// EmbeddedAudioPlayer.js - Clean audio player without automatic downloads

import React, { useState, useRef, useEffect } from 'react';

const EmbeddedAudioPlayer = ({ audioUrl, onDownload }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [audioUrl]);
  
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
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
  
  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else {
      // Manual download
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = 'story_audio.mp3';
      a.click();
    }
  };
  
  return (
    <div className="embedded-audio-player">
      <audio 
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
      />
      
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