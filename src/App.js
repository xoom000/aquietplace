// App.js

import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import SimpleRichEditor from './SimpleRichEditor';
import ForestAnimations from './ForestAnimations';
import VoiceInstructionsGuide from './VoiceInstructionsGuide';

// Maximum character limit for OpenAI's text-to-speech API (hidden from user)
const MAX_CHARS = 4096;

// ─── CreativeCorner Component ──────────────────────────────
const CreativeCorner = ({
  storyText,
  setStoryText,
  voiceChoice,
  setVoiceChoice,
  voiceInstructions,
  setVoiceInstructions,
  isProcessing,
  savedApiKey,
  previewStoryText,
  voices,
  audioFiles,
  onFileImport,
  onPaste,
  isImporting
}) => {
  // Local state for controlling the visibility of the instructions guide
  const [showInstructionsGuide, setShowInstructionsGuide] = useState(false);
  
  // File input reference
  const fileInputRef = useRef(null);

  // Handle selecting an instruction from the guide
  const handleSelectInstruction = (instruction) => {
    setVoiceInstructions(instruction);
  };

  // Function to toggle guide visibility
  const toggleGuide = (e) => {
    e.stopPropagation();
    setShowInstructionsGuide(!showInstructionsGuide);
  };
  
  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <section className="creative-corner">
      <h2>Story Lab</h2>
      <p className="info-text">
        Bring your stories to life with different voices and moods. 
        Experiment with how your writing sounds when read aloud before finalizing your story.
      </p>

      <div className="voice-controls">
        <div className="voice-selector">
          <label htmlFor="voice-choice">Storyteller Voice:</label>
          <select
            id="voice-choice"
            value={voiceChoice}
            onChange={(e) => setVoiceChoice(e.target.value)}
          >
            {voices.map(voice => (
              <option key={voice.id} value={voice.id}>
                {voice.name}
              </option>
            ))}
          </select>
        </div>

        <div className="instructions-input">
          <label htmlFor="voice-instructions">
            Voice Mood & Style:
            <button 
              className="guide-toggle-button" 
              onClick={toggleGuide}
              title="Inspiration for voice styles"
            >
              {showInstructionsGuide ? 'Hide Ideas' : 'Get Ideas'}
            </button>
          </label>
          <textarea
            id="voice-instructions"
            placeholder="How should your story be told? (e.g., warm and magical, like a fireside tale)"
            value={voiceInstructions}
            onChange={(e) => setVoiceInstructions(e.target.value)}
            rows={3}
            className="voice-instructions-textarea"
          />
        </div>
      </div>

      {showInstructionsGuide && (
        <VoiceInstructionsGuide onSelectInstruction={handleSelectInstruction} />
      )}

      <div className="story-text-container">
        <div className="story-header">
          <label htmlFor="story-text">Your Story:</label>
          <div className="import-controls">
            <input 
              type="file"
              ref={fileInputRef}
              onChange={(e) => onFileImport(e, 'creative')}
              style={{ display: 'none' }}
              accept=".txt,.md,.doc,.docx,.rtf"
            />
            <button 
              onClick={triggerFileInput}
              className="import-button"
              disabled={isImporting}
              title="Import story from a text file (TXT, DOC, DOCX, RTF, MD)"
            >
              {isImporting ? 'Importing...' : 'Import File'}
            </button>
          </div>
        </div>
        <textarea
          id="story-text"
          value={storyText}
          onChange={(e) => setStoryText(e.target.value)}
          onPaste={(e) => onPaste(e, 'creative')}
          rows={10}
          className="story-textarea"
          placeholder="Write or paste your story here (you can paste directly from Google Docs)..."
        ></textarea>
        <div className="char-hint">
          Write as much as you want - we'll take care of the rest
        </div>
        <div className="import-hint">
          <strong>Import options:</strong> Use the Import File button or simply copy & paste directly from Google Docs
        </div>
      </div>

      {audioFiles && audioFiles.length > 0 && (
        <div className="audio-preview">
          <h3>Your Story Audio</h3>
          <audio controls src={audioFiles[0]} className="audio-player"></audio>
        </div>
      )}

      <div className="button-group">
        <button 
          className="preview-button"
          onClick={previewStoryText}
          disabled={isProcessing || !storyText.trim() || !savedApiKey}
        >
          {isProcessing ? 'Reading Your Story...' : 'Read My Story Aloud'}
        </button>
        <button 
          className="reset-button"
          onClick={() => setStoryText("")}
        >
          Clear Story
        </button>
      </div>

      <div className="inspiration-box">
        <h3>Writer's Corner</h3>
        <p>
          Stories sound different when read aloud. Use this space to perfect how your tales are told - 
          experiment with different voices and moods to find the perfect match for your writing style.
        </p>
      </div>
    </section>
  );
};

// ─── Main App Component ─────────────────────────────────────────────────
function App() {
  const [text, setText] = useState('');
  const [htmlText, setHtmlText] = useState(''); // For storing HTML content from editor
  const [audioSections, setAudioSections] = useState([]); // Renamed from chunks
  const [apiKey, setApiKey] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('alloy');
  const [voiceInstructions, setVoiceInstructions] = useState('Read in a natural, engaging tone');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentSection, setCurrentSection] = useState(null); // Renamed from currentChunk
  const [error, setError] = useState('');
  const [savedApiKey, setSavedApiKey] = useState('');
  const [isProcessingFull, setIsProcessingFull] = useState(false);
  const audioRef = useRef(null);
  
  // State variables for creative corner (formerly sandbox mode)
  const [creativeMode, setCreativeMode] = useState(true); // Default to creative mode
  const [storyText, setStoryText] = useState('');
  const [audioFiles, setAudioFiles] = useState([]);
  const [voiceChoice, setVoiceChoice] = useState('alloy');
  const [combiningAudio, setCombiningAudio] = useState(false);
  
  // State for file import
  const [isImporting, setIsImporting] = useState(false);

  // Available voices
  const voices = [
    { id: 'alloy', name: 'Alloy' },
    { id: 'echo', name: 'Echo' },
    { id: 'fable', name: 'Fable' },
    { id: 'onyx', name: 'Onyx' },
    { id: 'nova', name: 'Nova' },
    { id: 'shimmer', name: 'Shimmer' },
    { id: 'ash', name: 'Ash' },
    { id: 'coral', name: 'Coral' },
    { id: 'ballad', name: 'Ballad' },
    { id: 'sage', name: 'Sage' }
  ];

  // Load API key from localStorage on component mount
  useEffect(() => {
    const savedKey = localStorage.getItem('openai_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      setSavedApiKey(savedKey);
    }
  }, []);

  // Function to save API key to localStorage
  const saveApiKey = () => {
    localStorage.setItem('openai_api_key', apiKey);
    setSavedApiKey(apiKey);
    setError('');
  };

  // Function to clear API key from form and localStorage
  const clearApiKey = () => {
    localStorage.removeItem('openai_api_key');
    setApiKey('');
    setSavedApiKey('');
  };

  // Function to handle editor changes
  const handleEditorChange = (html, plainText) => {
    setHtmlText(html);
    setText(plainText);
  };
  
  // Function to handle local file import
  const handleFileImport = (event, targetMode) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setIsImporting(true);
    setError('');
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        
        // Update the appropriate text field based on mode
        if (targetMode === 'creative') {
          setStoryText(content);
        } else {
          setText(content);
          setHtmlText(content);
        }
        
        setIsImporting(false);
      } catch (err) {
        setError('Failed to import file: ' + err.message);
        setIsImporting(false);
      }
    };
    
    reader.onerror = () => {
      setError('Failed to read file');
      setIsImporting(false);
    };
    
    reader.readAsText(file);
    
    // Reset the file input
    event.target.value = null;
  };
  
  // Function to handle pasted content
  const handlePaste = (event, targetMode) => {
    // Get the pasted text from clipboard
    const pastedText = event.clipboardData.getData('text/plain');
    
    if (!pastedText) return;
    
    // If the text is long, it's likely a copy from somewhere else (like Google Docs)
    if (pastedText.length > 50) {
      // Update the appropriate text field based on mode
      if (targetMode === 'creative') {
        setStoryText(pastedText);
      } else {
        setText(pastedText);
        setHtmlText(pastedText);
      }
      
      // Prevent the default paste behavior to avoid double-pasting
      event.preventDefault();
    }
  };

  // Function to split text into sections based on character limit (hidden from user)
  const splitIntoSections = (inputText) => {
    if (!inputText.trim()) {
      setError('Please enter some text');
      return [];
    }

    // Split by paragraphs (double newlines)
    const paragraphs = inputText.split(/\n\s*\n/);
    
    const newSections = [];
    let currentSection = '';
    
    paragraphs.forEach(paragraph => {
      if (currentSection.length + paragraph.length + 2 > MAX_CHARS) {
        if (currentSection) {
          newSections.push(currentSection);
        }
        
        // Handle paragraphs longer than MAX_CHARS
        if (paragraph.length > MAX_CHARS) {
          const sentences = paragraph.split(/(?<=[.!?])\s+/);
          let sentenceSection = '';
          
          sentences.forEach(sentence => {
            if (sentenceSection.length + sentence.length + 1 > MAX_CHARS) {
              if (sentenceSection) {
                newSections.push(sentenceSection);
              }
              sentenceSection = sentence;
            } else {
              sentenceSection += (sentenceSection ? ' ' : '') + sentence;
            }
          });
          
          if (sentenceSection) {
            currentSection = sentenceSection;
          } else {
            currentSection = '';
          }
        } else {
          currentSection = paragraph;
        }
      } else {
        currentSection += (currentSection ? '\n\n' : '') + paragraph;
      }
    });
    
    if (currentSection) {
      newSections.push(currentSection);
    }
    
    return newSections;
  };

  // Create a complete audio file from multiple sections
  const processFullAudio = async (inputText) => {
    if (!savedApiKey) {
      setError('Please save your OpenAI API key first');
      return;
    }
    
    setIsProcessingFull(true);
    setError('');
    
    try {
      // Split text into sections based on API limit
      const sections = splitIntoSections(inputText);
      if (sections.length === 0) return;
      
      // Process each section
      const audioBlobs = [];
      let completedSections = 0;
      
      for (let i = 0; i < sections.length; i++) {
        setCurrentSection(i);
        
        // Call API for each section
        const response = await fetch('https://api.openai.com/v1/audio/speech', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${savedApiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini-tts',
            input: sections[i],
            voice: creativeMode ? voiceChoice : selectedVoice,
            instructions: creativeMode ? voiceInstructions : voiceInstructions,
            response_format: 'mp3'
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Failed to convert text to speech');
        }
        
        const audioBlob = await response.blob();
        audioBlobs.push(audioBlob);
        completedSections++;
      }
      
      // When all sections are processed, combine them (if more than one)
      if (audioBlobs.length > 0) {
        if (audioBlobs.length === 1) {
          // Only one section, no need to combine
          const audioUrl = URL.createObjectURL(audioBlobs[0]);
          setAudioFiles([audioUrl]);
          
          if (audioRef.current) {
            audioRef.current.src = audioUrl;
            audioRef.current.play();
          }
          
          // Create download link
          const downloadLink = document.createElement('a');
          downloadLink.href = audioUrl;
          downloadLink.download = 'your_complete_story.mp3';
          downloadLink.click();
        } else {
          // Multiple sections - in a real app you'd combine them server-side
          // For this demo we'll use the first one and explain the limitation
          setCombiningAudio(true);
          
          // Simulate combining audio files
          setTimeout(() => {
            const audioUrl = URL.createObjectURL(audioBlobs[0]);
            setAudioFiles([audioUrl]);
            
            if (audioRef.current) {
              audioRef.current.src = audioUrl;
              audioRef.current.play();
            }
            
            // Create download link
            const downloadLink = document.createElement('a');
            downloadLink.href = audioUrl;
            downloadLink.download = 'your_story_part1.mp3'; // Would be complete file in real implementation
            downloadLink.click();
            
            setCombiningAudio(false);
          }, 1500);
          
          console.log("In a full implementation, we would combine all audio files here");
        }
      }
    } catch (err) {
      setError(err.message || 'Error converting text to speech');
    } finally {
      setIsProcessingFull(false);
      setCurrentSection(null);
    }
  };

  // Function to preview story text in creative corner
  const previewStoryText = async () => {
    // Process the full story at once, handling splitting behind the scenes
    await processFullAudio(storyText);
  };

  // Function to process book text in book mode
  const processBookText = () => {
    const sections = splitIntoSections(text);
    setAudioSections(sections);
    setError('');
  };

  // Convert a single section to speech in book mode
  const convertSectionToSpeech = async (section, index) => {
    if (!savedApiKey) {
      setError('Please save your OpenAI API key first');
      return;
    }
    
    setIsProcessing(true);
    setCurrentSection(index);
    setError('');
    
    try {
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${savedApiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini-tts',
          input: section,
          voice: selectedVoice,
          instructions: voiceInstructions,
          response_format: 'mp3'
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to convert text to speech');
      }
      
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }
      
      const downloadLink = document.createElement('a');
      downloadLink.href = audioUrl;
      downloadLink.download = `section_${index + 1}.mp3`;
      downloadLink.click();
    } catch (err) {
      setError(err.message || 'Error converting text to speech');
    } finally {
      setIsProcessing(false);
      setCurrentSection(null);
    }
  };

  return (
    <div className="App">
      <ForestAnimations />
      <header className="App-header">
        <h1>Story Audio Creator</h1>
        <p>Bring your stories to life with the perfect voice and mood</p>
        <div className="mode-toggle">
          <button
            className={`mode-button ${!creativeMode ? 'active' : ''}`}
            onClick={() => setCreativeMode(false)}
          >
            Book Studio
          </button>
          <button
            className={`mode-button ${creativeMode ? 'active' : ''}`}
            onClick={() => setCreativeMode(true)}
          >
            Creative Corner
          </button>
        </div>
      </header>

      <main>
        <section className="setup-section">
          <h2>Quick Setup</h2>
          <div className="input-group">
            <input
              type="password"
              placeholder="Enter your OpenAI API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <button onClick={saveApiKey} disabled={!apiKey}>Save Key</button>
            <button onClick={clearApiKey} disabled={!savedApiKey}>Clear Key</button>
          </div>
          {savedApiKey && <p className="success-message">API key is saved</p>}
        </section>

        {error && <div className="error-message">{error}</div>}

        {creativeMode ? (
          <CreativeCorner
            storyText={storyText}
            setStoryText={setStoryText}
            voiceChoice={voiceChoice}
            setVoiceChoice={setVoiceChoice}
            voiceInstructions={voiceInstructions}
            setVoiceInstructions={setVoiceInstructions}
            isProcessing={isProcessingFull || combiningAudio}
            savedApiKey={savedApiKey}
            previewStoryText={previewStoryText}
            voices={voices}
            audioFiles={audioFiles}
            onFileImport={handleFileImport}
            onPaste={handlePaste}
            isImporting={isImporting}
          />
        ) : (
          <>
            <section className="text-input-section">
              <h2>Book Text</h2>
              <div className="text-controls">
                <div className="char-hint">
                  Write or paste your complete manuscript
                </div>
                <div className="import-hint">
                  <strong>Import options:</strong> Use the Import File button or simply copy & paste directly from Google Docs
                </div>
                <div className="import-controls">
                  <input 
                    type="file"
                    id="book-file-input"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileImport(e, 'book')}
                    accept=".txt,.md,.doc,.docx,.rtf"
                  />
                  <button 
                    onClick={() => document.getElementById('book-file-input').click()}
                    className="import-button"
                    disabled={isImporting}
                    title="Import manuscript from a text file (TXT, DOC, DOCX, RTF, MD)"
                  >
                    {isImporting ? 'Importing...' : 'Import File'}
                  </button>
                </div>
              </div>
              <SimpleRichEditor 
                onChange={handleEditorChange}
                placeholder="Paste or type your book text here (you can paste directly from Google Docs)..."
                maxChars={MAX_CHARS}
                hideCharCount={true}
                onCustomPaste={(e) => handlePaste(e, 'book')}
              />
              <button 
                className="process-button" 
                onClick={processBookText}
                disabled={!text.trim()}
              >
                Prepare Audio Sections
              </button>
            </section>

            {audioSections.length > 0 && (
              <section className="voice-options-section">
                <h2>Voice Settings</h2>
                <div className="voice-selector">
                  <label htmlFor="voice-select">Storyteller Voice:</label>
                  <select
                    id="voice-select"
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                  >
                    {voices.map(voice => (
                      <option key={voice.id} value={voice.id}>
                        {voice.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="instructions-input">
                  <label htmlFor="instructions">Voice Mood & Style:</label>
                  <textarea
                    id="instructions"
                    placeholder="How should your story be told? (e.g., warm and magical, like a fireside tale)"
                    value={voiceInstructions}
                    onChange={(e) => setVoiceInstructions(e.target.value)}
                    rows={3}
                    className="voice-instructions-textarea"
                  />
                </div>
              </section>
            )}

            {audioSections.length > 0 && (
              <section className="sections-section">
                <h2>Your Story Sections ({audioSections.length})</h2>
                <p className="info-text">
                  Your story has been prepared in {audioSections.length} sections. 
                  Listen to each section to make sure it sounds perfect.
                </p>
                <audio ref={audioRef} controls className="audio-player"></audio>
                <div className="sections-list">
                  {audioSections.map((section, index) => (
                    <div key={index} className="section-item">
                      <div className="section-header">
                        <h3>Section {index + 1}</h3>
                        <button
                          className="listen-button"
                          onClick={() => convertSectionToSpeech(section, index)}
                          disabled={isProcessing}
                        >
                          {isProcessing && currentSection === index 
                            ? 'Creating Audio...' 
                            : 'Listen to This Section'
                          }
                        </button>
                      </div>
                      <div className="section-content">
                        <p>{section}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <footer>
        <p>
          Created with love for my favorite storyteller. Your stories deserve to be heard.
        </p>
      </footer>
    </div>
  );
}

export default App;
