// VoiceInstructionsGuide.js - Updated for better usability
import React, { useState } from 'react';

const VoiceInstructionsGuide = ({ onSelectInstruction }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  
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
      id: 'wilwheaton',
      title: 'Wil Wheaton Style',
      icon: '🎬',
      instruction: 'Read in the authentic, engaging style of Wil Wheaton narrating a first-person story. Use a conversational tone with natural inflection that adjusts dynamically to emotional context. Be attentive to emotional transitions - convey wry humor with subtle vocal changes, build anticipation in tense moments, and deliver dialogue with distinct character voices without overacting. Emphasize emotional honesty over dramatic performance, like you\'re sharing a personal story with friends around a table.'
    },
    {
      id: 'stephenfry',
      title: 'Stephen Fry Style',
      icon: '🧙‍♂️',
      instruction: 'Narrate with the eloquent, witty warmth of Stephen Fry. Speak with a cultivated British accent that combines gentle authority with playful intelligence. Handle humorous passages with subtle irony, deliver dialogue with charming character distinctions, and approach descriptive text with reverent appreciation. Maintain a comfortable, unhurried pace that gives weight to beautiful language while keeping the listener engaged through clear articulation and thoughtful emphasis.'
    },
    {
      id: 'neilgaiman',
      title: 'Neil Gaiman Style',
      icon: '🌑',
      instruction: 'Read with Neil Gaiman\'s distinct, mesmerizing cadence - a soft-spoken voice that carries immense weight. Deliver the text with an unhurried, deliberate pace, allowing anticipatory pauses that draw the listener deeper into the story. Approach magical or mysterious elements with a matter-of-fact tone that makes the extraordinary seem perfectly natural. Use subtle, nuanced inflection rather than dramatic performance, creating an intimate atmosphere as if telling a secret story meant only for the listener\'s ears.'
    },
    {
      id: 'levarburton',
      title: 'LeVar Burton Style',
      icon: '🌈',
      instruction: 'Narrate with LeVar Burton\'s warm, inviting storytelling style that combines welcoming friendliness with genuine passion for the material. Speak with clear, precise diction and a rhythmic flow that makes complex ideas accessible. Infuse your reading with authentic enthusiasm and gentle guidance, creating a sense of shared discovery. Use thoughtful pauses to let important moments resonate, and maintain an engaging, educational tone that respects the listener\'s intelligence while making them feel included in the journey.'
    },
    {
      id: 'juliawhelen',
      title: 'Julia Whelan Style',
      icon: '✨',
      instruction: 'Read with Julia Whelan\'s clear, versatile narration style that balances emotional authenticity with restrained performance. Deliver the text with perfect clarity and thoughtful pacing, using subtle vocal shifts to distinguish between characters without overacting. Approach emotional moments with genuine feeling that never becomes melodramatic. Maintain a sophisticated, intelligent tone that honors the text while bringing it vividly to life through precise articulation, natural rhythms, and intuitive emphasis on the right words.'
    },
    {
      id: 'michaelsheen',
      title: 'Michael Sheen Style',
      icon: '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
      instruction: 'Narrate with Michael Sheen\'s extraordinarily dynamic and passionate storytelling voice. Embrace the musicality of language with his Welsh-influenced cadence that rises and falls like a dramatic tide. Bring characters vividly to life through distinct vocal characterizations that feel authentic rather than caricatured. Approach dramatic moments with full emotional commitment, varying from hushed intensity to rousing declaration as the story demands. Read with a sense of wonder and reverence for the text, as if each word carries magic.'
    },
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
  
  return (
    <div className="instructions-guide" onClick={(e) => e.stopPropagation()}>
      <div className="guide-header">
        <h3>Voice Style Inspiration</h3>
        <p>Find the perfect way to tell your story with these voice styles</p>
      </div>
      
      <div className="guide-section">
        <p>Select a style below to help shape how your story is read. The voice will follow your instructions to create the perfect mood and delivery for your writing.</p>
        
        <h4>Style Categories</h4>
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
                        Use this
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
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
                Use this style
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VoiceInstructionsGuide;
