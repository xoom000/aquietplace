import React from 'react';
import './ReadingRulesDisplay.css';
import readingInstructions from './instructions.json';

const ReadingRulesDisplay = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const rules = readingInstructions.reading_instructions;

  return (
    <div className="rules-display-overlay" onClick={(e) => {
      if (e.target.className === 'rules-display-overlay') onClose();
    }}>
      <div className="rules-display">
        <div className="rules-header">
          <h2>📖 Reading Rules Reference</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="rules-intro">
          <p>These rules tell the AI how to interpret punctuation and formatting in your text:</p>
        </div>

        <div className="rules-grid">
          <div className="rule-card">
            <h3>Comma (,)</h3>
            <p className="rule-description">{rules.comma.description}</p>
            <p className="rule-example">Example: "{rules.comma.example}"</p>
            <p className="rule-instruction">→ {rules.comma.how_to_read}</p>
          </div>

          <div className="rule-card">
            <h3>Em Dash (—)</h3>
            <p className="rule-description">{rules.em_dash.description}</p>
            <p className="rule-example">Example: "{rules.em_dash.example}"</p>
            <p className="rule-instruction">→ {rules.em_dash.how_to_read}</p>
          </div>

          <div className="rule-card">
            <h3>Ellipsis (...)</h3>
            <p className="rule-description">{rules.ellipsis.description}</p>
            <p className="rule-example">Example: "{rules.ellipsis.example}"</p>
            <p className="rule-instruction">→ {rules.ellipsis.how_to_read}</p>
          </div>

          <div className="rule-card">
            <h3>Period (.)</h3>
            <p className="rule-description">{rules.period.description}</p>
            <p className="rule-example">Example: "{rules.period.example}"</p>
            <p className="rule-instruction">→ {rules.period.how_to_read}</p>
          </div>

          <div className="rule-card">
            <h3>Line Break</h3>
            <p className="rule-description">{rules.line_break.description}</p>
            <p className="rule-example">Example: {rules.line_break.example.split('\n\n').map((line, i) => (
              <span key={i}>{line}{i === 0 && <br/>}<br/></span>
            ))}</p>
            <p className="rule-instruction">→ {rules.line_break.how_to_read}</p>
          </div>

          <div className="rule-card">
            <h3>Exclamation (!)</h3>
            <p className="rule-description">{rules.exclamation.description}</p>
            <p className="rule-example">Example: "{rules.exclamation.example}"</p>
            <p className="rule-instruction">→ {rules.exclamation.how_to_read}</p>
          </div>

          <div className="rule-card">
            <h3>Question (?)</h3>
            <p className="rule-description">{rules.question.description}</p>
            <p className="rule-example">Example: "{rules.question.example}"</p>
            <p className="rule-instruction">→ {rules.question.how_to_read}</p>
          </div>

          <div className="rule-card">
            <h3>Italics (*text*)</h3>
            <p className="rule-description">{rules.italics.description}</p>
            {rules.italics.examples && (
              <div className="rule-examples">
                <p className="rule-example">Internal thought: "{rules.italics.examples.internal_monologue}"</p>
                <p className="rule-example">Sarcasm: "{rules.italics.examples.sarcasm}"</p>
                <p className="rule-example">Contrast: "{rules.italics.examples.contrast}"</p>
              </div>
            )}
            <p className="rule-instruction">→ {rules.italics.how_to_read}</p>
          </div>

          <div className="rule-card">
            <h3>Bold (**text**)</h3>
            <p className="rule-description">{rules.bold.description}</p>
            <p className="rule-example">Example: "{rules.bold.example}"</p>
            <p className="rule-instruction">→ {rules.bold.how_to_read}</p>
          </div>

          <div className="rule-card">
            <h3>Bold + Italics + Caps</h3>
            <p className="rule-description">{rules.bold_italics_caps.description}</p>
            <p className="rule-example">Example: "{rules.bold_italics_caps.example}"</p>
            <p className="rule-instruction">→ {rules.bold_italics_caps.how_to_read}</p>
          </div>

          <div className="rule-card">
            <h3>Stretched Words</h3>
            <p className="rule-description">{rules.stretched_words.description}</p>
            <p className="rule-example">Examples: {rules.stretched_words.examples.join(', ')}</p>
            <p className="rule-instruction">→ {rules.stretched_words.how_to_read}</p>
          </div>
        </div>

        <div className="rule-tip">
          <p><strong>💡 Pro Tip:</strong> {rules.final_tip}</p>
        </div>
      </div>
    </div>
  );
};

export default ReadingRulesDisplay;