// App.js

import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import SimpleRichEditor from './SimpleRichEditor';
import ForestAnimations from './ForestAnimations';
import VoiceInstructionsGuide from './VoiceInstructionsGuide';
import EmbeddedAudioPlayer from './EmbeddedAudioPlayer';
import ApiKeyHelp from './ApiKeyHelp';
import ReadingRulesDisplay from './ReadingRulesDisplay';
import { formatTextForTTS, enhanceVoiceInstructions } from './formatTextForTTS';
import readingInstructions from './instructions.json';
import mammoth from 'mammoth';

// Maximum character limit for OpenAI's text-to-speech API (hidden from user)
const MAX_CHARS = 4096;

// OpenAI TTS API pricing per 1,000 characters (in USD)
const PRICING = {
  'tts-1': 0.015,      // Standard model
  'tts-1-hd': 0.030,   // HD model
  'gpt-4o-mini-tts': 0.015  // Using the standard pricing rate for the mini model
};

// Function to calculate estimated cost based on character count and model
const calculateCost = (text, model = 'gpt-4o-mini-tts') => {
  if (!text) return { charCount: 0, cost: '0.0000', formattedCost: '$0.00' };
  
  // Get character count
  const charCount = text.length;
  
  // Calculate cost based on pricing per 1,000 characters
  const rate = PRICING[model] || PRICING['gpt-4o-mini-tts'];
  const cost = (charCount / 1000) * rate;
  
  // Return formatted cost
  return {
    charCount,
    cost: cost.toFixed(4),
    formattedCost: `$${cost.toFixed(2)}`
  };
};

// ─── CreativeCorner Component ──────────────────────────────
const CreativeCorner = ({
  storyText,
  setStoryText,
  storyHtml,
  setStoryHtml,
  voiceChoice,
  setVoiceChoice,
  voiceInstructions,
  setVoiceInstructions,
  isProcessing,
  apiKey,
  previewStoryText,
  voices,
  audioFiles,
  setAudioFiles,
  audioChunks,
  currentChunkIndex,
  setCurrentChunkIndex,
  textChunks,
  onFileImport,
  onPaste,
  isImporting,
  setShowCustomRules,
  useWilWheatonStyle,
  setUseWilWheatonStyle,
  costEstimate,
  apiProgress,
  ttsModel,
  setTtsModel,
  syntaxMode,
  setSyntaxMode
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
            name="voice-choice"
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
            name="voice-instructions"
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
      
      <div className="feature-controls">
        <div className="reading-rules-section">
          <button 
            className="manage-rules-btn"
            onClick={() => setShowCustomRules(true)}
            title="View reading rules reference"
          >
            📖 View Reading Rules
          </button>
          <p className="rules-hint">See how punctuation and formatting affect narration</p>
        </div>

        <div className="wil-wheaton-toggle">
          <label className="wil-toggle-label">
            <input
              type="checkbox"
              checked={useWilWheatonStyle}
              onChange={() => setUseWilWheatonStyle(!useWilWheatonStyle)}
            />
            <span className="toggle-text">Wil Wheaton Dynamic Inflection</span>
          </label>
          <p className="wil-hint">Enable dynamic inflection for first-person stories</p>
        </div>
        
        <div className="audio-quality-section">
          <label className="quality-label">Audio Quality:</label>
          <select 
            value={ttsModel} 
            onChange={(e) => setTtsModel(e.target.value)}
            className="quality-select"
            title="Select audio quality (HD is higher quality but costs more)"
          >
            <option value="tts-1">Standard Quality</option>
            <option value="tts-1-hd">HD Quality</option>
          </select>
          <p className="quality-hint">HD quality costs twice as much but sounds better</p>
        </div>
      </div>
      
      {/* Cost Estimate Display */}
      <div className="cost-estimate">
        <div className="cost-info">
          <span className="char-count">{costEstimate && costEstimate.charCount ? costEstimate.charCount.toLocaleString() : '0'} characters</span>
          <span className="cost-amount">{costEstimate && costEstimate.formattedCost ? costEstimate.formattedCost : '$0.00'}</span>
        </div>
        <p className="cost-hint">Estimated OpenAI API cost for TTS conversion</p>
      </div>

      <div className="story-text-container">
        <div className="story-header">
          <label htmlFor="story-text">Your Story:</label>
          <div className="import-controls">
            <input 
              type="file"
              ref={fileInputRef}
              onChange={(e) => onFileImport(e, 'creative')}
              style={{ display: 'none' }}
              accept=".txt,.md,.docx,text/plain,text/markdown,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            />
            <button 
              onClick={triggerFileInput}
              className="import-button"
              disabled={isImporting}
              title="Import story from a file (TXT, MD, DOCX)"
            >
              {isImporting ? 'Importing...' : 'Import File'}
            </button>
            <button
              onClick={() => setSyntaxMode(!syntaxMode)}
              className={`syntax-mode-toggle ${syntaxMode ? 'active' : ''}`}
              title={syntaxMode ? "Exit Syntax Mode" : "Enter Syntax Mode for emotional markup"}
            >
              {syntaxMode ? "Exit Syntax Mode" : "Syntax Mode"}
            </button>
          </div>
        </div>
        <SimpleRichEditor 
          onChange={(html, plainText) => {
            setStoryText(plainText);
            setStoryHtml(html);
          }}
          placeholder={syntaxMode ? 
            "Write your story with emotional markup tags like [emotion:anger]text[/emotion] or [tone:sarcastic]text[/tone]..." : 
            "Write or paste your story here (you can paste directly from Google Docs)..."}
          maxChars={MAX_CHARS * 5} // Allow longer stories in Creative Corner
          hideCharCount={false}
          onCustomPaste={(e) => onPaste(e, 'creative')}
          initialValue={storyText}
          syntaxMode={syntaxMode}
        />
        <div className="char-hint">
          Write as much as you want - we'll take care of the rest
        </div>
        <div className="import-hint">
          <strong>Import options:</strong> Use the Import File button or simply copy & paste directly from Google Docs
        </div>
        
        {syntaxMode && (
          <div className="syntax-mode-help">
            <h4>Syntax Mode Help</h4>
            <p>Add emotional markup to control how your text is read:</p>
            <ul>
              <li><code>[emotion:angry]This text sounds angry![/emotion]</code></li>
              <li><code>[tone:sarcastic]Oh, great...[/tone]</code></li>
              <li><code>[emphasis:strong]Very important![/emphasis]</code></li>
              <li><code>[pace:slow]Take your time...[/pace]</code></li>
              <li><code>[volume:whisper]Don't tell anyone.[/volume]</code></li>
            </ul>
            <p>These markups won't appear in normal mode but will affect how the AI reads your text.</p>
          </div>
        )}
      </div>

      <div className="button-group">
        <button 
          className="preview-button"
          onClick={previewStoryText}
          disabled={isProcessing || !storyText.trim() || !apiKey}
        >
          {isProcessing ? 'Creating Audio...' : 
           audioFiles.length > 0 ? 'Regenerate Audio' : 'Read My Story Aloud'}
        </button>
        <button 
          className="reset-button"
          onClick={() => {
            setStoryText("");
            setStoryHtml("");
            setAudioFiles([]);
          }}
        >
          Clear Story
        </button>
      </div>

      {isProcessing && (
        <div className="processing-status">
          <div className="loading-animation"></div>
          {apiProgress && apiProgress.isGenerating && apiProgress.total > 1 ? (
            <>
              <p>
                Converting your story to audio... 
                <span className="progress-text">
                  (Section {apiProgress.current} of {apiProgress.total})
                </span>
              </p>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${(apiProgress.current / apiProgress.total) * 100}%` }}
                ></div>
              </div>
              <p className="progress-estimate">
                Estimated time remaining: ~{Math.ceil((apiProgress.total - apiProgress.current) * 1.5)} seconds
              </p>
            </>
          ) : (
            <p>Converting your story to audio...</p>
          )}
        </div>
      )}

      {audioFiles && audioFiles.length > 0 && (
        <div className="audio-player-section">
          <EmbeddedAudioPlayer 
            audioUrl={audioFiles[0]}
            audioChunks={audioChunks}
            currentChunkIndex={currentChunkIndex}
            setCurrentChunkIndex={setCurrentChunkIndex}
            textChunks={textChunks}
            onDownload={() => {
              // Custom download handler for all chunks
              if (audioChunks.length > 1) {
                // Download current chunk
                const a = document.createElement('a');
                a.href = audioChunks[currentChunkIndex];
                a.download = `story_part_${currentChunkIndex + 1}.mp3`;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              } else {
                // Download single file
                const a = document.createElement('a');
                a.href = audioFiles[0];
                a.download = 'my_story.mp3';
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }
            }}
          />
        </div>
      )}

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
  const [selectedVoice, setSelectedVoice] = useState('alloy');
  const [voiceInstructions, setVoiceInstructions] = useState('Read in a natural, engaging tone');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentSection, setCurrentSection] = useState(null); // Renamed from currentChunk
  const [error, setError] = useState('');
  const [isProcessingFull, setIsProcessingFull] = useState(false);
  const audioRef = useRef(null);
  
  // API key management - use env in dev, user input in production
  // Store in sessionStorage (safer than localStorage)
  const [apiKey, setApiKey] = useState('');
  
  // State variables for creative corner (formerly sandbox mode)
  const [creativeMode, setCreativeMode] = useState(true); // Default to creative mode
  const [storyText, setStoryText] = useState('');
  const [storyHtml, setStoryHtml] = useState('');
  const [savedStoryText, setSavedStoryText] = useState(''); // For preserving creative mode content
  const [savedStoryHtml, setSavedStoryHtml] = useState(''); // For preserving creative mode HTML
  const [audioFiles, setAudioFiles] = useState([]);
  const [audioChunks, setAudioChunks] = useState([]); // Store all audio chunks
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0); // Track which chunk is being played
  const [textChunks, setTextChunks] = useState([]); // Store the text for each chunk
  const [voiceChoice, setVoiceChoice] = useState('alloy');
  const [combiningAudio, setCombiningAudio] = useState(false);
  const [useWilWheatonStyle, setUseWilWheatonStyle] = useState(false);
  
  // State for file import
  const [isImporting, setIsImporting] = useState(false);
  
  // State for API key help modal
  const [showApiKeyHelp, setShowApiKeyHelp] = useState(false);
  
  // State for custom rules manager
  const [showCustomRules, setShowCustomRules] = useState(false);
  
  // State for cost estimation
  const [costEstimate, setCostEstimate] = useState({ charCount: 0, cost: '0.0000', formattedCost: '$0.00' });
  
  // State for tracking API progress
  const [apiProgress, setApiProgress] = useState({ 
    current: 0, 
    total: 0, 
    isGenerating: false 
  });
  
  // State for TTS model selection (standard vs HD)
  const [ttsModel, setTtsModel] = useState('tts-1-hd'); // Default to HD for better quality
  
  // State for syntax mode
  const [syntaxMode, setSyntaxMode] = useState(false);

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

  // Use sessionStorage - persists until browser closes
  useEffect(() => {
    // Check for environment variable first
    if (process.env.REACT_APP_OPENAI_API_KEY) {
      setApiKey(process.env.REACT_APP_OPENAI_API_KEY);
    } else {
      // Otherwise check sessionStorage
      const storedKey = sessionStorage.getItem('openai_api_key');
      if (storedKey) {
        setApiKey(storedKey);
      }
    }
  }, []);
  
  // Update cost estimate when text changes
  useEffect(() => {
    if (creativeMode) {
      const formattedText = storyHtml ? formatTextForTTS(storyHtml) : storyText;
      updateCostEstimate(formattedText);
    } else {
      const formattedText = htmlText ? formatTextForTTS(htmlText) : text;
      updateCostEstimate(formattedText);
    }
  }, [creativeMode, storyText, storyHtml, text, htmlText]);

  // Function to handle editor changes
  const handleEditorChange = (html, plainText) => {
    setHtmlText(html);
    setText(plainText);
  };
  
  // Function to handle local file import
  const handleFileImport = async (event, targetMode) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    setIsImporting(true);
    setError('');
    
    try {
      let content = '';
      
      // Handle DOCX files with mammoth
      if (fileExtension === 'docx') {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        content = result.value;
      } 
      // Handle DOC files (mammoth doesn't support these)
      else if (fileExtension === 'doc') {
        setError('DOC files are not supported. Please save as DOCX or TXT.');
        setIsImporting(false);
        event.target.value = null;
        return;
      }
      // Handle plain text files
      else {
        content = await file.text();
      }
      
      // Check if we got any content
      if (!content || content.trim() === '') {
        setError('No readable text found in the file.');
        setIsImporting(false);
        return;
      }
      
      // Update the appropriate text field based on mode
      if (targetMode === 'creative') {
        setStoryText(content);
        setStoryHtml(content);
      } else {
        setText(content);
        setHtmlText(content);
      }
      
      setIsImporting(false);
    } catch (err) {
      setError(`Failed to import file: ${err.message}`);
      setIsImporting(false);
    }
    
    // Reset the file input
    event.target.value = null;
  };
  
  // Function to handle pasted content with HTML formatting
  const handlePaste = (event, targetMode) => {
    // Try to get HTML content first
    const pastedHtml = event.clipboardData.getData('text/html');
    const pastedText = event.clipboardData.getData('text/plain');
    
    if (!pastedText && !pastedHtml) return;
    
    // Always handle the paste for any text content
    // Update the appropriate text field based on mode
    if (targetMode === 'creative') {
      setStoryText(pastedText);
      
      // If HTML is available, use it to preserve formatting
      if (pastedHtml) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = pastedHtml;
        
        // Remove potentially dangerous elements
        const scripts = tempDiv.querySelectorAll('script, style, iframe');
        scripts.forEach(script => script.remove());
        
        setStoryHtml(tempDiv.innerHTML);
      } else {
        setStoryHtml(pastedText);
      }
    } else {
      setText(pastedText);
      setHtmlText(pastedHtml || pastedText);
    }
    
    // Prevent the default paste behavior to avoid double-pasting
    event.preventDefault();
  };

  // Function to split text into sections based on character limit (hidden from user)
  const splitIntoSections = (inputText, htmlText = null) => {
    if (!inputText.trim()) {
      setError('Please enter some text');
      return [];
    }

    // If we have HTML content, use it to preserve formatting
    const textToProcess = htmlText ? formatTextForTTS(htmlText) : inputText;

    // Split by paragraphs (double newlines)
    const paragraphs = textToProcess.split(/\n\s*\n/);
    
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
    if (!apiKey) {
      setError('OpenAI API key not found. Please set REACT_APP_OPENAI_API_KEY in .env file');
      return;
    }
    
    setIsProcessingFull(true);
    setError('');
    
    try {
      // Split text into sections based on API limit
      // We don't need to send HTML here since inputText is already formatted
      const sections = splitIntoSections(inputText);
      if (sections.length === 0) return;
      
      // Initialize progress tracking
      setApiProgress({
        current: 0,
        total: sections.length,
        isGenerating: true
      });
      
      // Process each section
      const audioBlobs = [];
      
      for (let i = 0; i < sections.length; i++) {
        setCurrentSection(i);
        
        // Update progress
        setApiProgress(prev => ({
          ...prev,
          current: i + 1
        }));
        
        // Call API for each section
        const response = await fetch('https://api.openai.com/v1/audio/speech', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: ttsModel,
            input: sections[i],
            voice: creativeMode ? voiceChoice : selectedVoice,
            instructions: enhanceVoiceInstructions(voiceInstructions, readingInstructions, useWilWheatonStyle),
            response_format: 'mp3'
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Failed to convert text to speech');
        }
        
        const audioBlob = await response.blob();
        audioBlobs.push(audioBlob);
      }
      
      // Process all audio sections
      if (audioBlobs.length > 0) {
        // Create URLs for all audio blobs
        const audioUrls = audioBlobs.map(blob => URL.createObjectURL(blob));
        
        // Update audio chunks state for multi-section playback
        setAudioChunks(audioUrls);
        
        // Store the text sections for reference
        setTextChunks(sections);
        
        // Reset the current chunk index to the beginning
        setCurrentChunkIndex(0);
        
        // For backwards compatibility, still set the audioFiles state
        setAudioFiles([audioUrls[0]]);
        
        // Clear combining indicator after a brief delay
        if (audioBlobs.length > 1) {
          setCombiningAudio(true);
          setTimeout(() => {
            setCombiningAudio(false);
          }, 500);
        }
      }
    } catch (err) {
      setError(err.message || 'Error converting text to speech');
    } finally {
      setIsProcessingFull(false);
      setCurrentSection(null);
      // Reset progress tracking
      setApiProgress({
        current: 0,
        total: 0,
        isGenerating: false
      });
    }
  };

  // Update cost estimate in real-time as user types
  const updateCostEstimate = (text) => {
    const formattedText = text ? formatTextForTTS(text) : '';
    const estimate = calculateCost(formattedText, ttsModel);
    setCostEstimate(estimate);
  };

  // Function to preview story text in creative corner
  const previewStoryText = async () => {
    // Use formatted text from HTML for TTS
    const formattedText = storyHtml ? formatTextForTTS(storyHtml) : storyText;
    
    // Calculate cost estimate before processing
    const estimate = calculateCost(formattedText, ttsModel);
    setCostEstimate(estimate);
    
    // Process the full story at once, handling splitting behind the scenes
    await processFullAudio(formattedText);
  };

  // Function to process book text in book mode
  const processBookText = () => {
    const sections = splitIntoSections(text, htmlText);
    setAudioSections(sections);
    setError('');
    
    // Calculate total cost for all sections
    let totalChars = 0;
    sections.forEach(section => {
      totalChars += section.length;
    });
    
    const totalEstimate = calculateCost(" ".repeat(totalChars));
    setCostEstimate(totalEstimate);
  };

  // Convert a single section to speech in book mode
  const convertSectionToSpeech = async (section, index) => {
    if (!apiKey) {
      setError('OpenAI API key not found. Please set REACT_APP_OPENAI_API_KEY in .env file');
      return;
    }
    
    // Calculate cost estimate for this section
    const estimate = calculateCost(section, ttsModel);
    setCostEstimate(estimate);
    
    setIsProcessing(true);
    setCurrentSection(index);
    setError('');
    
    // Set progress for single section (100% when done)
    setApiProgress({
      current: 0,
      total: 1,
      isGenerating: true
    });
    
    try {
      // Update progress to show we're sending the request
      setApiProgress({
        current: 0.5,
        total: 1,
        isGenerating: true
      });
      
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: ttsModel,
          input: section,
          voice: selectedVoice,
          instructions: enhanceVoiceInstructions(voiceInstructions, readingInstructions, useWilWheatonStyle),
          response_format: 'mp3'
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to convert text to speech');
      }
      
      // Update progress to show we're processing the response
      setApiProgress({
        current: 1,
        total: 1,
        isGenerating: true
      });
      
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }
      
      // Let the user manually download if they want
    } catch (err) {
      setError(err.message || 'Error converting text to speech');
    } finally {
      setIsProcessing(false);
      setCurrentSection(null);
      // Reset progress
      setApiProgress({
        current: 0,
        total: 0,
        isGenerating: false
      });
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
            onClick={() => {
              // Save current creative mode content before switching
              if (creativeMode) {
                setSavedStoryText(storyText);
                setSavedStoryHtml(storyHtml);
              }
              setCreativeMode(false);
            }}
          >
            Book Studio
          </button>
          <button
            className={`mode-button ${creativeMode ? 'active' : ''}`}
            onClick={() => {
              // Restore saved content when switching back to creative mode
              if (!creativeMode && savedStoryText) {
                setStoryText(savedStoryText);
                setStoryHtml(savedStoryHtml);
              }
              setCreativeMode(true);
            }}
          >
            Creative Corner
          </button>
        </div>
      </header>

      <main>
        {!apiKey && (
          <div className="api-key-bar">
            <label htmlFor="apiKeyInput" id="apiKeyLabel">
              OpenAI API Key Required:
            </label>
            <form className="api-key-controls" onSubmit={(e) => {
              e.preventDefault();
              if (apiKey) {
                sessionStorage.setItem('openai_api_key', apiKey);
              }
            }}>
              <input 
                type="text" 
                id="apiKeyUsername" 
                name="apiKeyUsername"
                autoComplete="username"
                value="openai-api-key"
                readOnly
                style={{ display: 'none' }} 
                aria-hidden="true"
              />
              <input
                id="apiKeyInput"
                name="apiKeyInput"
                type="password"
                autoComplete="new-password"
                placeholder="Enter your OpenAI API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="api-key-input"
              />
              <button 
                type="submit"
                disabled={!apiKey}
                className="api-key-save"
              >
                Save for Session
              </button>
              <button 
                type="button"
                onClick={() => setShowApiKeyHelp(true)}
                className="api-key-help-btn"
                title="How to get an API key"
              >
                ?
              </button>
            </form>
          </div>
        )}
        
        {!apiKey && (
          <div className="api-key-info">
            <p>Need an API key? Click the <span className="help-icon">?</span> button above for step-by-step instructions.</p>
          </div>
        )}
        
        {apiKey && (
          <div className="api-key-status">
            <span>API Key: ****{apiKey.slice(-4)}</span>
            <button 
              onClick={() => {
                setApiKey('');
                sessionStorage.removeItem('openai_api_key');
              }}
              className="clear-key-btn"
            >
              Clear Key
            </button>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        {creativeMode ? (
          <CreativeCorner
            storyText={storyText}
            setStoryText={setStoryText}
            storyHtml={storyHtml}
            setStoryHtml={setStoryHtml}
            voiceChoice={voiceChoice}
            setVoiceChoice={setVoiceChoice}
            voiceInstructions={voiceInstructions}
            setVoiceInstructions={setVoiceInstructions}
            isProcessing={isProcessingFull || combiningAudio}
            apiProgress={apiProgress}
            apiKey={apiKey}
            previewStoryText={previewStoryText}
            voices={voices}
            audioFiles={audioFiles}
            setAudioFiles={setAudioFiles}
            audioChunks={audioChunks}
            currentChunkIndex={currentChunkIndex}
            setCurrentChunkIndex={setCurrentChunkIndex}
            textChunks={textChunks}
            onFileImport={handleFileImport}
            onPaste={handlePaste}
            isImporting={isImporting}
            setShowCustomRules={setShowCustomRules}
            useWilWheatonStyle={useWilWheatonStyle}
            setUseWilWheatonStyle={setUseWilWheatonStyle}
            costEstimate={costEstimate}
            ttsModel={ttsModel}
            setTtsModel={setTtsModel}
            syntaxMode={syntaxMode}
            setSyntaxMode={setSyntaxMode}
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
                    accept=".txt,.md,.docx,text/plain,text/markdown,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  />
                  <button 
                    onClick={() => document.getElementById('book-file-input').click()}
                    className="import-button"
                    disabled={isImporting}
                    title="Import manuscript from a file (TXT, MD, DOCX)"
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
                initialValue={text}
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
                    name="voice-select"
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
                
                <div className="audio-quality-section book-mode">
                  <label htmlFor="quality-select">Audio Quality:</label>
                  <select
                    id="quality-select"
                    name="quality-select"
                    value={ttsModel}
                    onChange={(e) => setTtsModel(e.target.value)}
                    className="quality-select"
                  >
                    <option value="tts-1">Standard Quality</option>
                    <option value="tts-1-hd">HD Quality</option>
                  </select>
                  <p className="quality-hint">HD quality costs twice as much but sounds better</p>
                </div>
                <div className="instructions-input">
                  <label htmlFor="instructions">Voice Mood & Style:</label>
                  <textarea
                    id="instructions"
                    name="instructions"
                    placeholder="How should your story be told? (e.g., warm and magical, like a fireside tale)"
                    value={voiceInstructions}
                    onChange={(e) => setVoiceInstructions(e.target.value)}
                    rows={3}
                    className="voice-instructions-textarea"
                  />
                </div>

                {/* Cost Estimate Display */}
                <div className="cost-estimate">
                  <div className="cost-info">
                    <span className="char-count">{costEstimate && costEstimate.charCount ? costEstimate.charCount.toLocaleString() : '0'} characters</span>
                    <span className="cost-amount">{costEstimate && costEstimate.formattedCost ? costEstimate.formattedCost : '$0.00'}</span>
                  </div>
                  <p className="cost-hint">Estimated OpenAI API cost for TTS conversion</p>
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
                        <div className="section-details">
                          <span className="section-cost">
                            ~{calculateCost(section, ttsModel) && calculateCost(section, ttsModel).formattedCost ? calculateCost(section, ttsModel).formattedCost : '$0.00'} • {section ? section.length.toLocaleString() : '0'} chars
                          </span>
                          <button
                            className="listen-button"
                            onClick={() => convertSectionToSpeech(section, index)}
                            disabled={isProcessing}
                          >
                            {isProcessing && currentSection === index 
                              ? `Creating Audio... ${apiProgress.isGenerating ? Math.round((apiProgress.current / apiProgress.total) * 100) + '%' : ''}` 
                              : 'Listen to This Section'
                            }
                          </button>
                        </div>
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
      
      <ApiKeyHelp 
        isOpen={showApiKeyHelp} 
        onClose={() => setShowApiKeyHelp(false)} 
      />
      
      {showCustomRules && (
        <ReadingRulesDisplay 
          isOpen={showCustomRules}
          onClose={() => setShowCustomRules(false)} 
        />
      )}
    </div>
  );
}

export default App;
