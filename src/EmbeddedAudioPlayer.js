// EmbeddedAudioPlayer.js - Enhanced audio player with multi-chunk support

import React, { useState, useRef, useEffect } from 'react';

const EmbeddedAudioPlayer = ({ 
  audioUrl, 
  audioChunks = [], 
  currentChunkIndex = 0,
  setCurrentChunkIndex,
  textChunks = [],
  onDownload 
}) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  
  // Determine whether we're in multi-chunk mode
  const isMultiChunk = audioChunks && audioChunks.length > 1;
  
  // Current audio source based on mode
  const currentAudioSrc = isMultiChunk ? audioChunks[currentChunkIndex] : audioUrl;
  
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      if (isMultiChunk && currentChunkIndex < audioChunks.length - 1) {
        // Auto-play next chunk when current one ends
        setCurrentChunkIndex(currentChunkIndex + 1);
        // We'll play this in the next useEffect
      } else {
        setIsPlaying(false);
      }
    };
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    
    // Set volume from state when audio element is created/updated
    audio.volume = volume;
    
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentAudioSrc, currentChunkIndex, audioChunks, isMultiChunk, volume]);
  
  // Handle auto-play when changing chunks
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(err => console.error('Failed to auto-play:', err));
    }
  }, [currentChunkIndex, isPlaying]);
  
  const formatTime = (time) => {
    if (isNaN(time) || !isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.error('Failed to play:', err));
    }
  };
  
  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = percent * duration;
  };
  
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };
  
  const handleSkip = (seconds) => {
    audioRef.current.currentTime = Math.max(0, Math.min(duration, currentTime + seconds));
  };
  
  const handlePrevChunk = () => {
    if (currentChunkIndex > 0) {
      setCurrentChunkIndex(currentChunkIndex - 1);
    }
  };
  
  const handleNextChunk = () => {
    if (currentChunkIndex < audioChunks.length - 1) {
      setCurrentChunkIndex(currentChunkIndex + 1);
    }
  };
  
  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else {
      // Manual download of current chunk
      const a = document.createElement('a');
      a.href = currentAudioSrc;
      a.download = isMultiChunk ? `story_part_${currentChunkIndex + 1}.mp3` : 'story_audio.mp3';
      a.click();
    }
  };
  
  return (
    <div className="embedded-audio-player">
      <audio 
        ref={audioRef}
        src={currentAudioSrc}
        preload="metadata"
      />
      
      {isMultiChunk && (
        <div className="chunk-navigation">
          <div className="chunk-indicator">
            <span>Section {currentChunkIndex + 1} of {audioChunks.length}</span>
          </div>
          
          <div className="chunk-controls">
            <button 
              onClick={handlePrevChunk}
              disabled={currentChunkIndex === 0}
              className="chunk-nav-btn"
              aria-label="Previous section"
            >
              ⏮️ Prev
            </button>
            <button 
              onClick={handleNextChunk}
              disabled={currentChunkIndex === audioChunks.length - 1}
              className="chunk-nav-btn"
              aria-label="Next section"
            >
              Next ⏭️
            </button>
          </div>
          
          {textChunks && textChunks.length > currentChunkIndex && (
            <div className="chunk-text-preview">
              <h4>Current Section Text:</h4>
              <div className="chunk-text">
                {textChunks[currentChunkIndex]}
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="player-controls">
        <button 
          className="play-pause-btn"
          onClick={handlePlayPause}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        
        <div className="time-display">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
        
        <div 
          className="progress-bar"
          onClick={handleSeek}
        >
          <div 
            className="progress-fill"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>
        
        <div className="skip-controls">
          <button 
            onClick={() => handleSkip(-10)}
            className="skip-btn"
            aria-label="Skip back 10 seconds"
          >
            -10s
          </button>
          <button 
            onClick={() => handleSkip(10)}
            className="skip-btn"
            aria-label="Skip forward 10 seconds"
          >
            +10s
          </button>
        </div>
        
        <div className="volume-control">
          <span>🔊</span>
          <input 
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            className="volume-slider"
          />
        </div>
        
        <button 
          onClick={handleDownload}
          className="download-btn"
          aria-label="Download audio"
        >
          💾 Download
        </button>
      </div>
    </div>
  );
};

export default EmbeddedAudioPlayer;