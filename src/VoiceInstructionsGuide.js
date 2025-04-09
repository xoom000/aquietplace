// VoiceInstructionsGuide.js
import React, { useState } from 'react';

const VoiceInstructionsGuide = ({ onSelectInstruction }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Define instruction categories
  const instructionCategories = [
    {
      id: 'emotional',
      title: 'Emotional Tone',
      icon: '😊',
      examples: [
        { label: 'Cheerful', instruction: 'Read with enthusiasm and joy' },
        { label: 'Calm', instruction: 'Speak in a peaceful, soothing manner' },
        { label: 'Wistful', instruction: 'Narrate with gentle nostalgia' },
        { label: 'Dramatic', instruction: 'Read with intensity and emotion' }
      ]
    },
    {
      id: 'nature',
      title: 'Nature Inspired',
      icon: '🌲',
      examples: [
        { label: 'Forest', instruction: 'Speak like whispering through trees' },
        { label: 'Flowing', instruction: 'Read with the rhythm of a gentle stream' },
        { label: 'Earthy', instruction: 'Narrate with a grounded, warm tone' },
        { label: 'Seasonal', instruction: 'Read with autumn\'s golden warmth' }
      ]
    },
    {
      id: 'pacing',
      title: 'Pacing & Flow',
      icon: '⏱️',
      examples: [
        { label: 'Deliberate', instruction: 'Read slowly, savoring each word' },
        { label: 'Dynamic', instruction: 'Vary your pace with the content' },
        { label: 'Reflective', instruction: 'Pause thoughtfully between ideas' },
        { label: 'Rhythmic', instruction: 'Speak with a gentle cadence' }
      ]
    },
    {
      id: 'storytelling',
      title: 'Storytelling Style',
      icon: '📚',
      examples: [
        { label: 'Enchanting', instruction: 'Read like a fireside storyteller' },
        { label: 'Intimate', instruction: 'Narrate as if sharing a secret' },
        { label: 'Classic', instruction: 'Speak like a traditional audiobook narrator' },
        { label: 'Evocative', instruction: 'Read with vivid imagery in your voice' }
      ]
    },
    {
      id: 'quality',
      title: 'Voice Qualities',
      icon: '🔊',
      examples: [
        { label: 'Warm', instruction: 'Speak with a rich, comforting tone' },
        { label: 'Whispered', instruction: 'Read in a hushed, intimate voice' },
        { label: 'Resonant', instruction: 'Use a deep, full vocal quality' },
        { label: 'Gentle', instruction: 'Speak softly with a light touch' }
      ]
    },
    {
      id: 'character',
      title: 'Character Types',
      icon: '🎭',
      examples: [
        { label: 'Wise', instruction: 'Speak like an elderly village storyteller' },
        { label: 'Magical', instruction: 'Read like a woodland fairy guide' },
        { label: 'Folksy', instruction: 'Narrate with rustic charm' },
        { label: 'Mystical', instruction: 'Speak like a keeper of ancient secrets' }
      ]
    }
  ];
  
  // Define combination examples
  const combinationExamples = [
    {
      id: 'forest',
      title: 'Forest Nighttime Tale',
      icon: '🌙',
      instruction: 'Read with the hushed, gentle tone of a woodland storyteller beneath an old oak tree. Speak slowly and softly, like whispering forest secrets under the stars.'
    },
    {
      id: 'book',
      title: 'Classic Book Chapter',
      icon: '📖',
      instruction: 'Narrate with the warm, measured cadence of a professional audiobook reader. Use a rich tone with thoughtful pacing, slightly varying your delivery for different characters and emotional moments.'
    },
    {
      id: 'meditation',
      title: 'Nature Meditation',
      icon: '🌿',
      instruction: 'Speak in a peaceful, grounding voice with the tranquility of a forest stream. Read slowly and softly with gentle pauses, allowing your voice to have a calming, meditative quality.'
    }
  ];
  
  // Handle instruction selection
  const handleTryExample = (instruction, e) => {
    // Stop event propagation to prevent parent click handlers from firing
    e.stopPropagation();
    
    if (onSelectInstruction) {
      onSelectInstruction(instruction);
    }
  };
  
  // Toggle category expand/collapse with a dedicated handler
  const toggleCategory = (categoryId, e) => {
    // Important: Stop the click from propagating to parent elements
    e.stopPropagation();
    
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
    }
  };
  
  return (
    <div className="instructions-guide" onClick={(e) => e.stopPropagation()}>
      <div className="guide-header">
        <h3>Voice Instructions Guide</h3>
        <p>Discover how to craft the perfect narrative tone for your stories</p>
      </div>
      
      <div className="guide-section">
        <p>The text-to-speech service understands natural language instructions that help shape how voices read your text. This allows you to create a personalized audio experience that enhances your storytelling with the perfect mood and delivery.</p>
        
        <h4>Instruction Categories</h4>
        <div className="instruction-categories">
          {instructionCategories.map(category => (
            <div 
              key={category.id} 
              className="instruction-category"
              onClick={(e) => toggleCategory(category.id, e)}
            >
              <div className="category-header">
                <div className="category-icon">{category.icon}</div>
                <div className="category-title">{category.title}</div>
              </div>
              
              {selectedCategory === category.id && (
                <ul className="examples-list">
                  {category.examples.map((example, index) => (
                    <li key={index} onClick={(e) => e.stopPropagation()}>
                      <strong>{example.label}:</strong> {example.instruction}
                      <button 
                        className="try-button"
                        onClick={(e) => handleTryExample(example.instruction, e)}
                      >
                        Try this
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
        
        <div className="guide-tips">
          <h4>Tips for Better Results</h4>
          <ul className="tips-list">
            <li><strong>Be descriptive but concise</strong> - Clear, focused instructions work better than lengthy explanations</li>
            <li><strong>Combine elements</strong> - "Speak with a warm, rhythmic tone like a storyteller by the campfire"</li>
            <li><strong>Match voice to content</strong> - Use calming instructions for peaceful scenes, excited for action</li>
          </ul>
        </div>
        
        <h4>Try these combinations:</h4>
        <div className="instruction-categories">
          {combinationExamples.map(example => (
            <div key={example.id} className="instruction-category" onClick={(e) => e.stopPropagation()}>
              <div className="category-header">
                <div className="category-icon">{example.icon}</div>
                <div className="category-title">{example.title}</div>
              </div>
              <p style={{ margin: '10px 0', color: '#c9c4a7' }}>{example.instruction}</p>
              <button 
                className="try-button"
                onClick={(e) => handleTryExample(example.instruction, e)}
              >
                Try this combination
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VoiceInstructionsGuide;
