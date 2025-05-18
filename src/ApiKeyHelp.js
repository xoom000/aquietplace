import React from 'react';
import './ApiKeyHelp.css';

const ApiKeyHelp = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="api-key-help-modal">
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h2>How to Get Your OpenAI API Key</h2>
        
        <div className="help-steps">
          <div className="step">
            <span className="step-number">1</span>
            <div className="step-content">
              <h3>Sign in to OpenAI</h3>
              <p>Go to <a href="https://platform.openai.com" target="_blank" rel="noopener noreferrer">platform.openai.com</a> and sign in with your OpenAI account.</p>
            </div>
          </div>
          
          <div className="step">
            <span className="step-number">2</span>
            <div className="step-content">
              <h3>Navigate to API Keys</h3>
              <p>Click on <strong>API keys</strong> in the left sidebar or go directly to <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">API Keys page</a>.</p>
            </div>
          </div>
          
          <div className="step">
            <span className="step-number">3</span>
            <div className="step-content">
              <h3>Create New Key</h3>
              <p>Click <strong>"Create new secret key"</strong>, give it a descriptive name like "A Quiet Place".</p>
            </div>
          </div>
          
          <div className="step">
            <span className="step-number">4</span>
            <div className="step-content">
              <h3>Copy Your Key</h3>
              <p>Copy the key immediately - you won't be able to see it again! Paste it into the field above.</p>
              <p className="warning">⚠️ Never share your API key with anyone!</p>
            </div>
          </div>
        </div>
        
        <div className="additional-info">
          <h3>Important Notes:</h3>
          <ul>
            <li>API usage requires a paid OpenAI account or credits</li>
            <li>Text-to-speech costs: ~$15 per 1M characters</li>
            <li>Your key is stored only for this browser session</li>
            <li>The key is never sent anywhere except OpenAI's servers</li>
          </ul>
        </div>
        
        <div className="help-links">
          <a href="https://help.openai.com/en/articles/4936850-where-do-i-find-my-openai-api-key" target="_blank" rel="noopener noreferrer">
            Official Guide: Finding Your API Key
          </a>
          <a href="https://platform.openai.com/docs/guides/text-to-speech" target="_blank" rel="noopener noreferrer">
            OpenAI Text-to-Speech Documentation
          </a>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyHelp;