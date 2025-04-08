// Updated imports for App.js
import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import SimpleRichEditor from './SimpleRichEditor';
import ForestAnimations from './ForestAnimations';
import VoiceInstructionsGuide from './VoiceInstructionsGuide';

// Maximum character limit for OpenAI's text-to-speech API
const MAX_CHARS = 4096;

function App() {
  const [text, setText] = useState('');
  const [htmlText, setHtmlText] = useState(''); // For storing HTML content from editor
  const [chunks, setChunks] = useState([]);
  const [apiKey, setApiKey] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('alloy');
  const [instructions, setInstructions] = useState('Read in a natural, engaging tone');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentChunk, setCurrentChunk] = useState(null);
  const [error, setError] = useState('');
  const [savedApiKey, setSavedApiKey] = useState('');
  const audioRef = useRef(null);
  
  // State variables for sandbox mode
  const [sandboxMode, setSandboxMode] = useState(false);
  const [sampleText, setSampleText] = useState(
    "This is a sample text to try out different voices and instructions without using your API credits. You can experiment with different settings here before processing your actual book text."
  );
  const [audioPreviewUrl, setAudioPreviewUrl] = useState('');
  const [previewVoice, setPreviewVoice] = useState('alloy');
  const [previewInstructions, setPreviewInstructions] = useState('Read in a natural, engaging tone');

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

  // Function to split text into chunks based on paragraphs
  const splitIntoChunks = () => {
    if (!text.trim()) {
      setError('Please enter some text');
      return;
    }

    // Split by paragraphs (double newlines)
    const paragraphs = text.split(/\n\s*\n/);
    
    const newChunks = [];
    let currentChunk = '';
    
    paragraphs.forEach(paragraph => {
      // If adding this paragraph would exceed the limit, start a new chunk
      if (currentChunk.length + paragraph.length + 2 > MAX_CHARS) {
        if (currentChunk) {
          newChunks.push(currentChunk);
        }
        
        // If a single paragraph is too long, split it further
        if (paragraph.length > MAX_CHARS) {
          // Split by sentences
          const sentences = paragraph.split(/(?<=[.!?])\s+/);
          let sentenceChunk = '';
          
          sentences.forEach(sentence => {
            if (sentenceChunk.length + sentence.length + 1 > MAX_CHARS) {
              if (sentenceChunk) {
                newChunks.push(sentenceChunk);
              }
              sentenceChunk = sentence;
            } else {
              sentenceChunk += (sentenceChunk ? ' ' : '') + sentence;
            }
          });
          
          if (sentenceChunk) {
            currentChunk = sentenceChunk;
          } else {
            currentChunk = '';
          }
        } else {
          currentChunk = paragraph;
        }
      } else {
        // Add paragraph to current chunk
        currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
      }
    });
    
    // Add the last chunk if it's not empty
    if (currentChunk) {
      newChunks.push(currentChunk);
    }
    
    setChunks(newChunks);
    setError('');
  };

  // Function to convert a text chunk to speech
  const convertChunkToSpeech = async (chunk, index) => {
    if (!savedApiKey) {
      setError('Please save your OpenAI API key first');
      return;
    }

    setIsProcessing(true);
    setCurrentChunk(index);
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
          input: chunk,
          voice: selectedVoice,
          instructions: instructions,
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

      // Create download link
      const downloadLink = document.createElement('a');
      downloadLink.href = audioUrl;
      downloadLink.download = `chunk_${index + 1}.mp3`;
      downloadLink.click();

    } catch (err) {
      setError(err.message || 'Error converting text to speech');
    } finally {
      setIsProcessing(false);
      setCurrentChunk(null);
    }
  };

  // Function to preview sample text in sandbox mode
  const previewSampleText = async () => {
    if (!savedApiKey) {
      setError('Please save your OpenAI API key first');
      return;
    }

    if (!sampleText.trim()) {
      setError('Please enter some text to preview');
      return;
    }

    setIsProcessing(true);
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
          input: sampleText,
          voice: previewVoice,
          instructions: previewInstructions,
          response_format: 'mp3'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to generate preview');
      }

      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioPreviewUrl(url);

    } catch (err) {
      setError(err.message || 'Error generating audio preview');
    } finally {
      setIsProcessing(false);
    }
  };
  
// Updated SandboxSection with Instructions Guide Integration
const SandboxSection = () => {
  // State to control the visibility of the instructions guide
  const [showInstructionsGuide, setShowInstructionsGuide] = useState(false);
  
  // Handle selecting an instruction from the guide
  const handleSelectInstruction = (instruction) => {
    setPreviewInstructions(instruction);
    setShowInstructionsGuide(false); // Hide guide after selection
  };
  
  return (
    <section className="sandbox-section">
      <h2>Voice Sandbox</h2>
      <p className="info-text">
        Try different voices and instructions with sample text without using your API credits.
        This helps you choose the perfect settings before processing your actual book.
      </p>

      <div className="sandbox-controls">
        <div className="voice-selector">
          <label htmlFor="preview-voice">Select Voice:</label>
          <select
            id="preview-voice"
            value={previewVoice}
            onChange={(e) => setPreviewVoice(e.target.value)}
          >
            {voices.map(voice => (
              <option key={voice.id} value={voice.id}>
                {voice.name}
              </option>
            ))}
          </select>
        </div>

        <div className="instructions-input">
          <label htmlFor="preview-instructions">
            Reading Instructions:
            <button 
              className="guide-toggle-button" 
              onClick={() => setShowInstructionsGuide(!showInstructionsGuide)}
              title="Show instructions guide"
            >
              {showInstructionsGuide ? 'Hide Guide' : 'Show Guide'}
            </button>
          </label>
          <input
            id="preview-instructions"
            type="text"
            placeholder="How should the text be read?"
            // Fix for input issue - using defaultValue instead of value
            defaultValue={previewInstructions}
            onBlur={(e) => setPreviewInstructions(e.target.value)}
          />
        </div>
      </div>
      
      {/* Instructions Guide (conditionally rendered) */}
      {showInstructionsGuide && (
        <VoiceInstructionsGuide onSelectInstruction={handleSelectInstruction} />
      )}

      <div className="sample-text-container">
        <label htmlFor="sample-text">Sample Text:</label>
        <textarea
          id="sample-text"
          value={sampleText}
          onChange={(e) => setSampleText(e.target.value)}
          rows={4}
        ></textarea>
        <div className="char-count">
          Characters: {sampleText.length} / {MAX_CHARS} maximum per chunk
        </div>
      </div>

      {audioPreviewUrl && (
        <div className="audio-preview">
          <h3>Audio Preview</h3>
          <audio controls src={audioPreviewUrl} className="audio-player"></audio>
        </div>
      )}

      <div className="button-group">
        <button 
          className="preview-button"
          onClick={previewSampleText}
          disabled={isProcessing || !sampleText.trim() || !savedApiKey}
        >
          {isProcessing ? 'Generating...' : 'Generate Preview'}
        </button>
        <button 
          className="reset-button"
          onClick={() => setSampleText("This is a sample text to try out different voices and instructions without using your API credits. You can experiment with different settings here before processing your actual book text.")}
        >
          Reset Sample Text
        </button>
      </div>

      <div className="api-usage-info">
        <h3>API Usage Information</h3>
        <p>
          OpenAI charges based on the number of characters processed. Each API call also counts toward your rate limits.
          Using this sandbox will consume a small amount of your API credits with each preview.
        </p>
        <div className="usage-estimate">
          <p>Estimated cost for this preview: ${((sampleText.length / 1000) * 0.015).toFixed(4)} USD</p>
          <p>Based on OpenAI's pricing of $0.015 per 1K characters</p>
        </div>
      </div>
    </section>
  );
};

  return (
    <div className="App">
      <ForestAnimations />
      <header className="App-header">
        <h1>Book to Speech Converter</h1>
        <p>Convert your book text into spoken audio using OpenAI's text-to-speech service</p>
        
        {/* Mode toggle buttons */}
        <div className="mode-toggle">
          <button
            className={`mode-button ${!sandboxMode ? 'active' : ''}`}
            onClick={() => setSandboxMode(false)}
          >
            Book Mode
          </button>
          <button
            className={`mode-button ${sandboxMode ? 'active' : ''}`}
            onClick={() => setSandboxMode(true)}
          >
            Sandbox Mode
          </button>
        </div>
      </header>

      <main>
        <section className="api-key-section">
          <h2>API Key</h2>
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

        {/* Conditional rendering based on selected mode */}
        {sandboxMode ? (
          <SandboxSection />
        ) : (
          <>
            <section className="text-input-section">
              <h2>Book Text</h2>
              <div className="text-controls">
                <div className="char-count">
                  Characters: {text.length} / {MAX_CHARS} maximum per chunk
                </div>
              </div>
              
              {/* Use the simple rich editor instead of textarea */}
              <SimpleRichEditor 
                onChange={handleEditorChange}
                placeholder="Paste or type your book text here..."
                maxChars={MAX_CHARS}
              />
              
              <button 
                className="split-button" 
                onClick={splitIntoChunks}
                disabled={!text.trim()}
              >
                Split into Chunks
              </button>
            </section>

            {chunks.length > 0 && (
              <section className="voice-options-section">
                <h2>Voice Options</h2>
                <div className="voice-selector">
                  <label htmlFor="voice-select">Select Voice:</label>
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
                  <label htmlFor="instructions">Reading Instructions:</label>
                  <input
                    id="instructions"
                    type="text"
                    placeholder="How should the text be read? (e.g., calm, excited, etc.)"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                  />
                </div>
              </section>
            )}

            {chunks.length > 0 && (
              <section className="chunks-section">
                <h2>Text Chunks ({chunks.length})</h2>
                <p className="info-text">
                  Your text has been split into {chunks.length} chunks. 
                  Click "Generate Audio" for each chunk to convert it to speech.
                </p>
                
                <audio ref={audioRef} controls className="audio-player"></audio>

                <div className="chunks-list">
                  {chunks.map((chunk, index) => (
                    <div key={index} className="chunk-item">
                      <div className="chunk-header">
                        <h3>Chunk {index + 1}</h3>
                        <button
                          className="generate-button"
                          onClick={() => convertChunkToSpeech(chunk, index)}
                          disabled={isProcessing}
                        >
                          {isProcessing && currentChunk === index 
                            ? 'Processing...' 
                            : 'Generate Audio'
                          }
                        </button>
                      </div>
                      <div className="chunk-content">
                        <p>{chunk}</p>
                        <div className="char-info">
                          {chunk.length} characters
                        </div>
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
          Note: This application uses OpenAI's text-to-speech API, which requires an API key and may have usage costs.
          Your API key is stored locally in your browser and is never sent to any server except OpenAI's API.
        </p>
      </footer>
    </div>
  );
}

export default App;
