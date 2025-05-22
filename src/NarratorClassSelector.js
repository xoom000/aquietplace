// NarratorClassSelector.js - Streamlined narrator style selector
import React, { useState } from 'react';
import './NarratorClassSelector.css';

const NarratorClassSelector = ({ onSelectNarratorClass }) => {
  // Simplified narrator styles - focused on quality over quantity
  const narratorStyles = [
    {
      id: 'favorites',
      title: 'Top Picks',
      styles: [
        {
          id: 'wilwheaton',
          name: 'Wil Wheaton',
          icon: '🎬',
          description: 'Perfect for first-person stories - conversational and emotionally engaging',
          instruction: 'Read in the authentic, engaging style of Wil Wheaton. Use a conversational tone with natural inflection that adjusts to emotional context. Be attentive to emotional transitions and deliver dialogue with distinct character voices without overacting. Emphasize emotional honesty over dramatic performance, like sharing a personal story with friends.'
        },
        {
          id: 'neilgaiman',
          name: 'Neil Gaiman',
          icon: '🌑',
          description: 'Mesmerizing storyteller perfect for fantasy and mysterious tales',
          instruction: 'Read with Neil Gaiman\'s distinct, mesmerizing cadence - soft-spoken but carrying immense weight. Use an unhurried, deliberate pace with anticipatory pauses. Approach magical elements with matter-of-fact delivery that makes the extraordinary seem natural.'
        },
        {
          id: 'warm',
          name: 'Warm & Cozy',
          icon: '☕',
          description: 'Perfect for feel-good stories and intimate tales',
          instruction: 'Speak with a rich, comforting tone like honey and warm spices. Create an intimate atmosphere as if sharing stories with close friends by a fireplace. Keep pacing relaxed and unhurried, allowing genuine warmth to suffuse your voice.'
        }
      ]
    },
    {
      id: 'moods',
      title: 'Story Moods',
      styles: [
        {
          id: 'dramatic',
          name: 'Dramatic & Intense',
          icon: '⚡',
          description: 'For action-packed and emotionally charged stories',
          instruction: 'Narrate with commanding presence and controlled intensity. Vary pacing dramatically and allow your voice to fully embody the emotional landscape, from thunderous excitement to hushed intimacy.'
        },
        {
          id: 'suspense',
          name: 'Suspense & Thriller',
          icon: '🔍',
          description: 'Perfect for mysteries and tension-filled narratives',
          instruction: 'Read with measured pacing that builds suspense. Control timing precisely - slow during revelations, quicken during action. Maintain an undercurrent of unease even in quiet moments.'
        },
        {
          id: 'comedy',
          name: 'Light & Playful',
          icon: '😂',
          description: 'Great for humorous and lighthearted content',
          instruction: 'Read with bright, energetic delivery and good comic timing. Use quick pacing that accelerates for funny moments and pauses for punchlines. Let genuine amusement color your voice.'
        },
        {
          id: 'calm',
          name: 'Calm & Soothing',
          icon: '🍃',
          description: 'Peaceful narration for relaxing stories',
          instruction: 'Read with a peaceful, grounding voice. Use gentle pacing with thoughtful pauses. Keep tone smooth and even, creating a meditative atmosphere.'
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