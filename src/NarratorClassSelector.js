// NarratorClassSelector.js - Streamlined narrator style selector
import React, { useState } from 'react';
import './NarratorClassSelector.css';

const NarratorClassSelector = ({ onSelectNarratorClass }) => {
  // All narrator styles with minimal but effective instructions
  const narratorStyles = [
    {
      id: 'classic',
      title: 'Classic & Literary',
      styles: [
        {
          id: 'stephenfry',
          name: 'Stephen Fry',
          icon: '🧙‍♂️',
          description: 'Eloquent, witty British',
          instruction: 'Narrate with the eloquent, witty warmth of Stephen Fry. Speak with a cultivated British accent that combines gentle authority with playful intelligence.'
        },
        {
          id: 'neilgaiman',
          name: 'Neil Gaiman',
          icon: '🌑',
          description: 'Mesmerizing, deliberate',
          instruction: 'Read with Neil Gaiman\'s distinct, mesmerizing cadence - a soft-spoken voice that carries immense weight. Deliver the text with an unhurried, deliberate pace.'
        },
        {
          id: 'wilwheaton',
          name: 'Wil Wheaton',
          icon: '🎬',
          description: 'Engaging, emotional',
          instruction: 'Read in the authentic, engaging style of Wil Wheaton. Use a conversational tone with natural inflection that adjusts dynamically to emotional context.'
        }
      ]
    },
    {
      id: 'genre',
      title: 'Genre Specialists',
      styles: [
        {
          id: 'fantasy',
          name: 'Fantasy Epic',
          icon: '🧙',
          description: 'Dramatic, magical',
          instruction: 'Narrate with wonder and gravitas. Let your voice convey awe at magical elements and vary your delivery for different character types. Speak as if recounting legendary tales.'
        },
        {
          id: 'thriller',
          name: 'Suspense Thriller',
          icon: '🔍',
          description: 'Tense, measured',
          instruction: 'Read with intensity and measured pacing that builds unbearable suspense. Control your pacing precisely - slowing during crucial revelations and quickening during action sequences.'
        },
        {
          id: 'horror',
          name: 'Horror',
          icon: '👻',
          description: 'Chilling, atmospheric',
          instruction: 'Narrate with a deep, unsettling voice that sends chills down the spine. Use measured pacing with strategic pauses that create tension and dread.'
        },
        {
          id: 'comedy',
          name: 'Comedy',
          icon: '😂',
          description: 'Playful, well-timed',
          instruction: 'Read with bright, energetic delivery and impeccable comic timing. Use quick pacing that accelerates for funny moments and pauses for punchlines.'
        }
      ]
    },
    {
      id: 'tone',
      title: 'Tonal Approaches',
      styles: [
        {
          id: 'warm',
          name: 'Warm & Intimate',
          icon: '☕',
          description: 'Cozy, welcoming',
          instruction: 'Speak with a rich, comforting tone like honey and warm spices. Create an intimate atmosphere as if sharing stories with close friends by a fireplace.'
        },
        {
          id: 'dramatic',
          name: 'Dramatic & Intense',
          icon: '⚡',
          description: 'Bold, passionate',
          instruction: 'Narrate with commanding presence and intense, authoritative delivery. Use controlled intensity that can escalate to powerful emotion when the story demands it.'
        },
        {
          id: 'calm',
          name: 'Calm & Soothing',
          icon: '🍃',
          description: 'Peaceful, measured',
          instruction: 'Read with a peaceful, grounding voice. Use gentle pacing with thoughtful pauses, allowing your voice to have a calming quality.'
        },
        {
          id: 'playful',
          name: 'Playful & Energetic',
          icon: '🎪',
          description: 'Fun, dynamic',
          instruction: 'Narrate with infectious enthusiasm and playful energy. Vary your delivery to create a sense of fun and adventure throughout the story.'
        }
      ]
    }
  ];
  
  // Handle style selection
  const handleSelectStyle = (instruction, name) => {
    if (onSelectNarratorClass) {
      onSelectNarratorClass(instruction, name);
    }
  };
  
  return (
    <div className="narrator-style-selector">
      <div className="style-grid">
        {narratorStyles.map(category => (
          <div key={category.id} className="style-category">
            <h4 className="category-title">{category.title}</h4>
            <div className="style-buttons">
              {category.styles.map(style => (
                <button
                  key={style.id}
                  className="style-button"
                  onClick={() => handleSelectStyle(style.instruction, style.name)}
                  title={style.description}
                >
                  <span className="style-icon">{style.icon}</span>
                  <span className="style-name">{style.name}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NarratorClassSelector;