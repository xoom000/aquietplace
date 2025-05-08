// VoiceInstructionsGuide.js - Updated for better usability
import React, { useState, useEffect } from 'react';

const VoiceInstructionsGuide = ({ onSelectInstruction }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Define instruction categories - expanded with more creative writing focused options
  const instructionCategories = [
    {
      id: 'emotional',
      title: 'Emotional Tone',
      icon: '😊',
      examples: [
        { label: 'Cheerful', instruction: 'Read with enthusiasm and joy, like sharing good news with a friend' },
        { label: 'Calm', instruction: 'Speak in a peaceful, soothing manner, like a gentle forest guide' },
        { label: 'Wistful', instruction: 'Narrate with gentle nostalgia, like remembering cherished memories' },
        { label: 'Dramatic', instruction: 'Read with intensity and emotion, bringing every moment to life' },
        { label: 'Thoughtful', instruction: 'Speak in a contemplative, philosophical tone with thoughtful pauses' }
      ]
    },
    {
      id: 'nature',
      title: 'Nature Inspired',
      icon: '🌲',
      examples: [
        { label: 'Forest', instruction: 'Speak like whispering through ancient trees in a misty woodland' },
        { label: 'Flowing', instruction: 'Read with the rhythm of a gentle stream, flowing naturally from word to word' },
        { label: 'Earthy', instruction: 'Narrate with a grounded, warm tone like stories told around a campfire' },
        { label: 'Seasonal', instruction: 'Read with autumn\'s golden warmth, rich and comforting like harvest time' },
        { label: 'Elemental', instruction: 'Speak with the changing qualities of nature - sometimes gentle like a breeze, sometimes powerful like a storm' }
      ]
    },
    {
      id: 'pacing',
      title: 'Pacing & Flow',
      icon: '⏱️',
      examples: [
        { label: 'Deliberate', instruction: 'Read slowly, savoring each word like tasting fine honey' },
        { label: 'Dynamic', instruction: 'Vary your pace with the content - quicken with action, slow with emotion' },
        { label: 'Reflective', instruction: 'Pause thoughtfully between ideas, giving weight to important moments' },
        { label: 'Rhythmic', instruction: 'Speak with a gentle cadence that carries the listener along like a lullaby' },
        { label: 'Natural', instruction: 'Read with the natural rhythm of conversation, as if you\'re speaking to a dear friend' }
      ]
    },
    {
      id: 'storytelling',
      title: 'Storytelling Style',
      icon: '📚',
      examples: [
        { label: 'Enchanting', instruction: 'Read like a fireside storyteller keeping listeners spellbound into the night' },
        { label: 'Intimate', instruction: 'Narrate as if sharing a secret with your closest friend in a quiet moment' },
        { label: 'Classic', instruction: 'Speak like a traditional audiobook narrator with perfect clarity and warmth' },
        { label: 'Evocative', instruction: 'Read with vivid imagery in your voice, painting pictures with your words' },
        { label: 'Bardic', instruction: 'Tell the story like an ancient bard who keeps traditions alive through tales' }
      ]
    },
    {
      id: 'quality',
      title: 'Voice Qualities',
      icon: '🔊',
      examples: [
        { label: 'Warm', instruction: 'Speak with a rich, comforting tone like honey and warm spices' },
        { label: 'Whispered', instruction: 'Read in a hushed, intimate voice as if sharing precious secrets' },
        { label: 'Resonant', instruction: 'Use a deep, full vocal quality that resonates with emotion and presence' },
        { label: 'Gentle', instruction: 'Speak softly with a light touch, tender and careful with each word' },
        { label: 'Melodic', instruction: 'Let your voice rise and fall like music, finding the melody in language' }
      ]
    },
    {
      id: 'character',
      title: 'Character Types',
      icon: '🎭',
      examples: [
        { label: 'Wise Elder', instruction: 'Speak like an elderly village storyteller who has seen many seasons come and go' },
        { label: 'Magical Guide', instruction: 'Read like a woodland fairy guide who knows all the forest\'s secrets' },
        { label: 'Folksy Friend', instruction: 'Narrate with rustic charm, like sharing tales over a warm hearth' },
        { label: 'Mystical Keeper', instruction: 'Speak like a keeper of ancient secrets, with reverence and wonder' },
        { label: 'Kind Mentor', instruction: 'Read with the gentle wisdom of someone guiding a beloved student' }
      ]
    },
    {
      id: 'genres',
      title: 'Genre Styles',
      icon: '📖',
      examples: [
        { label: 'Fantasy', instruction: 'Read with a sense of wonder and magic, as if describing impossible things made real' },
        { label: 'Romance', instruction: 'Narrate with warmth and emotional depth, tender in moments of connection' },
        { label: 'Mystery', instruction: 'Speak with subtle intrigue and measured revelation, building anticipation' },
        { label: 'Children\'s', instruction: 'Read with playful energy and clear expression, full of gentle enthusiasm' },
        { label: 'Poetry', instruction: 'Savor the rhythm and music of each line, giving space to the beauty of language' }
      ]
    }
  ];
  
  // Define combination examples
  const combinationExamples = [
    {
      id: 'forest',
      title: 'Forest Nighttime Tale',
      icon: '🌙',
      instruction: 'Read with the hushed, gentle tone of a woodland storyteller beneath an old oak tree. Speak slowly and softly, like whispering forest secrets under the stars, with a voice that rises and falls like evening breezes through ancient trees.'
    },
    {
      id: 'book',
      title: 'Classic Book Chapter',
      icon: '📖',
      instruction: 'Narrate with the warm, measured cadence of a professional audiobook reader. Use a rich tone with thoughtful pacing, slightly varying your delivery for different characters and emotional moments, creating a sense of intimacy like a story told just for the listener.'
    },
    {
      id: 'meditation',
      title: 'Nature Meditation',
      icon: '🌿',
      instruction: 'Speak in a peaceful, grounding voice with the tranquility of a forest stream. Read slowly and softly with gentle pauses, allowing your voice to have a calming, meditative quality that brings the listener into a state of peaceful presence.'
    },
    {
      id: 'fantasy',
      title: 'Epic Fantasy Adventure',
      icon: '🏰',
      instruction: 'Tell the story with the grand, resonant voice of a master bard in a medieval hall. Let your voice convey wonder at magical elements, tension during moments of peril, and triumph during victories. Speak as if recounting legendary tales that will be remembered for generations.'
    },
    {
      id: 'romance',
      title: 'Tender Love Story',
      icon: '💖',
      instruction: 'Narrate with gentle warmth and emotional intimacy, like sharing cherished memories. Slow your pace during moments of connection, and let your voice soften with tenderness. Read as if each word is a precious gift being carefully given to someone deeply loved.'
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
  
  // Mobile-optimized category component
  const MobileCategoryItem = ({ category, isSelected, onToggle }) => (
    <div 
      className={`instruction-category mobile-category ${isSelected ? 'mobile-active' : ''}`}
      onClick={(e) => onToggle(category.id, e)}
    >
      <div className="category-header">
        <div className="category-icon">{category.icon}</div>
        <div className="category-title">{category.title}</div>
        <div className="mobile-toggle-icon">{isSelected ? '−' : '+'}</div>
      </div>
      
      {isSelected && (
        <ul className="examples-list mobile-examples">
          {category.examples.map((example, index) => (
            <li key={index} onClick={(e) => e.stopPropagation()}>
              <div className="mobile-example-header">
                <strong>{example.label}</strong>
                <button 
                  className="try-button"
                  onClick={(e) => handleTryExample(example.instruction, e)}
                >
                  Use
                </button>
              </div>
              <div className="mobile-example-text">{example.instruction}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
  
  // Mobile-optimized combination component
  const MobileCombinationItem = ({ example }) => (
    <div className="instruction-category mobile-combination">
      <div className="category-header">
        <div className="category-icon">{example.icon}</div>
        <div className="category-title">{example.title}</div>
        <button 
          className="try-button mobile-use-button"
          onClick={(e) => handleTryExample(example.instruction, e)}
        >
          Use
        </button>
      </div>
      <p className="mobile-combo-text">{example.instruction}</p>
    </div>
  );
  
  return (
    <div className="instructions-guide" onClick={(e) => e.stopPropagation()}>
      <div className="guide-header">
        <h3>Voice Style Inspiration</h3>
        <p>Find the perfect way to tell your story with these voice styles</p>
      </div>
      
      <div className={`guide-section ${isMobile ? 'mobile-guide' : ''}`}>
        {!isMobile && (
          <p>Select a style below to help shape how your story is read. The voice will follow your instructions to create the perfect mood and delivery for your writing.</p>
        )}
        
        <h4>Style Categories</h4>
        <div className="instruction-categories">
          {isMobile ? (
            // Mobile optimized categories
            instructionCategories.map(category => (
              <MobileCategoryItem 
                key={category.id}
                category={category}
                isSelected={selectedCategory === category.id}
                onToggle={toggleCategory}
              />
            ))
          ) : (
            // Desktop categories
            instructionCategories.map(category => (
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
                          Use this
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          )}
        </div>
        
        <div className="guide-tips">
          <h4>Tips for Beautiful Narration</h4>
          <ul className="tips-list">
            <li><strong>Be descriptive but concise</strong> - Clear instructions work better than lengthy explanations</li>
            <li><strong>Combine elements</strong> - Mix emotions, pace, and tone for a richer experience</li>
            <li><strong>Match voice to content</strong> - Align the voice style with your story's mood</li>
            <li><strong>Experiment freely</strong> - Try different styles to find what brings your writing to life</li>
          </ul>
        </div>
        
        <h4>Ready-to-use Combinations:</h4>
        <div className="instruction-categories">
          {isMobile ? (
            // Mobile optimized combinations
            combinationExamples.map(example => (
              <MobileCombinationItem key={example.id} example={example} />
            ))
          ) : (
            // Desktop combinations
            combinationExamples.map(example => (
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
                  Use this style
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceInstructionsGuide;
