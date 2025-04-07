// App.js - Main React component for the Book to Speech Converter

import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Maximum character limit for OpenAI's text-to-speech API
const MAX_CHARS = 4096;

function App() {
  const [text, setText] = useState('');
  const [chunks, setChunks] = useState([]);
  const [apiKey, setApiKey] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('alloy');
  const [instructions, setInstructions] = useState('Read in a natural, engaging tone');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentChunk, setCurrentChunk] = useState(null);
  const [error, setError] = useState('');
  const [savedApiKey, setSavedApiKey] = useState('');
  const audioRef = useRef(null);

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

  // Function to handle text area changes and show character count
  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Book to Speech Converter</h1>
        <p>Convert your book text into spoken audio using OpenAI's text-to-speech service</p>
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

        <section className="text-input-section">
          <h2>Book Text</h2>
          <div className="text-controls">
            <div className="char-count">
              Characters: {text.length} / {MAX_CHARS} maximum per chunk
            </div>
          </div>
          <textarea
            placeholder="Paste your book text here"
            value={text}
            onChange={handleTextChange}
            rows={10}
          ></textarea>
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

        {error && <div className="error-message">{error}</div>}

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
