import React, { useState, useEffect } from 'react';
import './CustomRulesManager.css';

const CustomRulesManager = ({ onClose }) => {
  const [customRules, setCustomRules] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    pattern: '',
    description: '',
    example: '',
    how_to_read: ''
  });

  // Load custom rules from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('customTTSRules');
    if (stored) {
      try {
        setCustomRules(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load custom rules:', e);
      }
    }
  }, []);

  // Save custom rules to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('customTTSRules', JSON.stringify(customRules));
  }, [customRules]);

  const handleAddRule = () => {
    if (newRule.name && newRule.pattern && newRule.how_to_read) {
      setCustomRules([...customRules, { ...newRule, id: Date.now() }]);
      setNewRule({
        name: '',
        pattern: '',
        description: '',
        example: '',
        how_to_read: ''
      });
      setShowAddForm(false);
    }
  };

  const handleDeleteRule = (id) => {
    setCustomRules(customRules.filter(rule => rule.id !== id));
  };

  return (
    <div className="rules-manager-overlay" onClick={(e) => {
      if (e.target.className === 'rules-manager-overlay') onClose();
    }}>
      <div className="rules-manager">
        <div className="rules-header">
          <h2>🔧 Custom Reading Rules</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="rules-explanation">
          <div className="info-box">
            <h3>What are Reading Rules?</h3>
            <p>Reading rules tell the AI how to interpret specific patterns in your text:</p>
            <ul>
              <li><strong>Pattern:</strong> What to look for (like "--" for em-dash)</li>
              <li><strong>How to Read:</strong> Instructions for the AI (like "pause dramatically")</li>
            </ul>
            <p className="note">These are different from voice mood/style, which sets the overall tone for your story.</p>
          </div>
        </div>

        <div className="existing-rules">
          <h3>Your Custom Rules</h3>
          {customRules.length === 0 ? (
            <p className="no-rules">No custom rules yet. Add one below!</p>
          ) : (
            <div className="rules-list">
              {customRules.map(rule => (
                <div key={rule.id} className="rule-item">
                  <div className="rule-header">
                    <h4>{rule.name}</h4>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteRule(rule.id)}
                      title="Delete rule"
                    >
                      🗑️
                    </button>
                  </div>
                  <div className="rule-content">
                    <p><strong>Pattern:</strong> <code>{rule.pattern}</code></p>
                    {rule.description && <p><strong>Description:</strong> {rule.description}</p>}
                    {rule.example && <p><strong>Example:</strong> "{rule.example}"</p>}
                    <p><strong>How to Read:</strong> {rule.how_to_read}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {!showAddForm && (
          <button 
            className="add-rule-btn"
            onClick={() => setShowAddForm(true)}
          >
            + Add New Rule
          </button>
        )}

        {showAddForm && (
          <div className="add-rule-form">
            <h3>Add New Rule</h3>
            <div className="form-group">
              <label>Rule Name *</label>
              <input
                type="text"
                value={newRule.name}
                onChange={(e) => setNewRule({...newRule, name: e.target.value})}
                placeholder="e.g., Triple Dash"
              />
            </div>
            
            <div className="form-group">
              <label>Pattern to Match *</label>
              <input
                type="text"
                value={newRule.pattern}
                onChange={(e) => setNewRule({...newRule, pattern: e.target.value})}
                placeholder="e.g., ---"
              />
              <small>The text pattern the AI should look for</small>
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                value={newRule.description}
                onChange={(e) => setNewRule({...newRule, description: e.target.value})}
                placeholder="e.g., Long dramatic pause"
              />
            </div>
            
            <div className="form-group">
              <label>Example Usage</label>
              <input
                type="text"
                value={newRule.example}
                onChange={(e) => setNewRule({...newRule, example: e.target.value})}
                placeholder="e.g., He turned---and she was gone."
              />
            </div>
            
            <div className="form-group">
              <label>How to Read *</label>
              <textarea
                value={newRule.how_to_read}
                onChange={(e) => setNewRule({...newRule, how_to_read: e.target.value})}
                placeholder="e.g., Take a long, dramatic pause. Lower voice slightly after the pause."
                rows="3"
              />
              <small>Instructions for the AI on how to read this pattern</small>
            </div>
            
            <div className="form-buttons">
              <button 
                className="save-btn"
                onClick={handleAddRule}
                disabled={!newRule.name || !newRule.pattern || !newRule.how_to_read}
              >
                Save Rule
              </button>
              <button 
                className="cancel-btn"
                onClick={() => {
                  setShowAddForm(false);
                  setNewRule({
                    name: '',
                    pattern: '',
                    description: '',
                    example: '',
                    how_to_read: ''
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomRulesManager;