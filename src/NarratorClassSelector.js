// NarratorClassSelector.js - RPG-inspired narrator class selection
import React, { useState } from 'react';
import './NarratorClassSelector.css';

const NarratorClassSelector = ({ onSelectNarratorClass }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Define narrator classes by genre
  const narratorClasses = [
    // Base Narrator Classes
    {
      id: 'base',
      title: 'Classic Narrators',
      icon: '📚',
      classes: [
        {
          id: 'wilwheaton',
          title: 'Wil Wheaton',
          icon: '🎬',
          description: 'Conversational, engaging first-person narrator with dynamic emotional shifts',
          instruction: 'Read in the authentic, engaging style of Wil Wheaton narrating a first-person story. Use a conversational tone with natural inflection that adjusts dynamically to emotional context. Be attentive to emotional transitions - convey wry humor with subtle vocal changes, build anticipation in tense moments, and deliver dialogue with distinct character voices without overacting. Emphasize emotional honesty over dramatic performance, like you\'re sharing a personal story with friends around a table.'
        },
        {
          id: 'stephenfry',
          title: 'Stephen Fry',
          icon: '🧙‍♂️',
          description: 'Eloquent, witty British narrator with playful intelligence',
          instruction: 'Narrate with the eloquent, witty warmth of Stephen Fry. Speak with a cultivated British accent that combines gentle authority with playful intelligence. Handle humorous passages with subtle irony, deliver dialogue with charming character distinctions, and approach descriptive text with reverent appreciation. Maintain a comfortable, unhurried pace that gives weight to beautiful language while keeping the listener engaged through clear articulation and thoughtful emphasis.'
        },
        {
          id: 'neilgaiman',
          title: 'Neil Gaiman',
          icon: '🌑',
          description: 'Mesmerizing, soft-spoken storyteller who makes the extraordinary seem natural',
          instruction: 'Read with Neil Gaiman\'s distinct, mesmerizing cadence - a soft-spoken voice that carries immense weight. Deliver the text with an unhurried, deliberate pace, allowing anticipatory pauses that draw the listener deeper into the story. Approach magical or mysterious elements with a matter-of-fact tone that makes the extraordinary seem perfectly natural. Use subtle, nuanced inflection rather than dramatic performance, creating an intimate atmosphere as if telling a secret story meant only for the listener\'s ears.'
        }
      ]
    },
    // Fantasy Narrators
    {
      id: 'fantasy',
      title: 'Fantasy Narrators',
      icon: '🧙',
      classes: [
        {
          id: 'michaelsheen',
          title: 'Michael Sheen',
          icon: '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
          description: 'Dynamic Welsh storyteller with passionate, musical delivery',
          instruction: 'Narrate with Michael Sheen\'s extraordinarily dynamic and passionate storytelling voice. Embrace the musicality of language with his Welsh-influenced cadence that rises and falls like a dramatic tide. Bring characters vividly to life through distinct vocal characterizations that feel authentic rather than caricatured. Approach dramatic moments with full emotional commitment, varying from hushed intensity to rousing declaration as the story demands. Read with a sense of wonder and reverence for the text, as if each word carries magic.'
        },
        {
          id: 'andyserkis',
          title: 'Andy Serkis',
          icon: '💍',
          description: 'Intensely dramatic with incredible range for character voices',
          instruction: 'Channel Andy Serkis\'s extraordinary range and intensity when narrating. Bring a theatrical gravitas to descriptive passages while morphing effortlessly between character voices. Give each character a distinctive vocal identity with remarkable physical embodiment in your voice. Alternate between whispered intensity and commanding projection as the story requires. Approach fantasy elements with a commitment that makes them utterly believable, speaking of magical things as if they are real and present.'
        },
        {
          id: 'robingould',
          title: 'Robin Miles',
          icon: '✨',
          description: 'Masterful voice actor who creates immersive fantasy worlds',
          instruction: 'Narrate with Robin Miles\' extraordinary versatility and warm, resonant tone. Bring distinct character voices to life with subtle yet clear differentiations in accent, pitch, and rhythm. Handle multiple fantasy languages and dialects with confident authority. Create magical atmospheres through vocal texture, using breathy whispers for mystery and robust proclamations for moments of power. Read descriptive passages with a reverent attention to sensory detail that transports listeners fully into the fantasy world.'
        }
      ]
    },
    // Horror Narrators
    {
      id: 'horror',
      title: 'Horror Narrators',
      icon: '👻',
      classes: [
        {
          id: 'tonyjonesgates',
          title: 'Tony Todd',
          icon: '🪝',
          description: 'Deep, resonant voice perfect for instilling dread',
          instruction: 'Narrate with Tony Todd\'s deep, resonant voice that sends chills down the spine. Speak with measured pacing, allowing silence to create tension and dread. During intense moments, let your voice drop to an unsettling near-whisper that forces listeners to lean in. Use a matter-of-fact delivery for disturbing content, making the horror more believable through understated narration. Allow subtle vocal tremors during moments of fear, and employ your lower register to create a sense of inescapable danger lurking beneath the surface of the story.'
        },
        {
          id: 'katereading',
          title: 'Kate Reading',
          icon: '🕯️',
          description: 'Precise, clear narrator who builds atmospheric tension',
          instruction: 'Channel Kate Reading\'s clear, precise delivery with its underlying current of tension. Narrate horror with controlled restraint, allowing the terrifying content to speak for itself rather than overplaying it. Use perfectly timed pauses before revelations to build suspense. Maintain a calm, almost clinical tone that makes horrific elements more disturbing through contrast. Deliver dialogue with subtle character distinctions while keeping the overall atmosphere cool and unsettling, like a witness recounting events too terrible to fully process.'
        },
        {
          id: 'dougbradley',
          title: 'Doug Bradley',
          icon: '📌',
          description: 'Iconic horror narrator with hypnotic, menacing depth',
          instruction: 'Narrate with Doug Bradley\'s hypnotic, menacing delivery that draws listeners into darkness. Speak with deliberate, measured pacing and a resonant lower register that suggests hidden depths of horror. Deliver terrifying content with an almost pleasurable relish, like a predator toying with prey. Use precise articulation and a slightly formal quality that creates disturbing contrast with horrific content. Allow subtle vocal modulations that hint at restrained madness or ancient malevolence waiting to be unleashed.'
        }
      ]
    },
    // Comedy Narrators
    {
      id: 'comedy',
      title: 'Comedy Narrators',
      icon: '😂',
      classes: [
        {
          id: 'amypoehler',
          title: 'Amy Poehler',
          icon: '🎭',
          description: 'Energetic, playful storyteller with perfect comic timing',
          instruction: 'Channel Amy Poehler\'s bright, energetic narration style with impeccable comedic timing. Deliver humorous lines with a knowing playfulness that invites listeners to be in on the joke. Use quick pacing that accelerates during funny moments and slows for punchlines. Allow genuine laughter to occasionally bubble through your narration, creating an infectious sense of fun. Approach dialogue with character-driven comedy instincts, finding the humor in vocal mannerisms without resorting to caricature. Maintain a warm, approachable tone throughout that feels like a funny friend telling stories.'
        },
        {
          id: 'nickofferman',
          title: 'Nick Offerman',
          icon: '🥃',
          description: 'Dry, deadpan delivery with underlying warmth',
          instruction: 'Narrate with Nick Offerman\'s distinctive dry humor and measured cadence. Deliver absurd or outrageous content with complete deadpan seriousness, letting the contrast create comedy. Use a gruff, slightly gravelly tone with underlying warmth that occasionally breaks through. Take your time with punchlines, allowing them to land through perfect timing rather than emphasis. Let occasional giggles or chuckles break through the stoic delivery at particularly ridiculous moments. Approach the narration with the confident ease of a master craftsman telling tales around a workshop.'
        },
        {
          id: 'tinavsilent',
          title: 'Tina Fey',
          icon: '🤓',
          description: 'Sharp, witty narrator with self-deprecating charm',
          instruction: 'Read with Tina Fey\'s quick, intelligent delivery and perfect comic timing. Narrate with a slightly self-aware tone that acknowledges the humor without overplaying it. Use a conversational pace that accelerates during comedic riffs then pauses for punchlines. Deliver sarcastic or ironic comments with subtle vocal inflections rather than obvious emphasis. Approach absurd situations with a matter-of-fact delivery that makes them funnier through contrast. Allow occasional asides that feel like breaking the fourth wall, creating complicity with the listener in acknowledging the ridiculousness of certain situations.'
        }
      ]
    },
    // Thriller Narrators
    {
      id: 'thriller',
      title: 'Thriller Narrators',
      icon: '🔍',
      classes: [
        {
          id: 'scottbrick',
          title: 'Scott Brick',
          icon: '🕵️',
          description: 'Master of suspense with perfect tension-building pacing',
          instruction: 'Narrate with Scott Brick\'s signature intensity and measured pacing that builds unbearable suspense. Use a resonant, compelling tone that draws listeners deeper into the mystery or danger. Deliver dialogue with subtle but distinct character voices that never distract from the mounting tension. Control your pacing precisely - slowing during crucial revelations and quickening during action sequences. Allow a slight edge of urgency to permeate even calm moments, hinting at dangers to come. Emphasize key revelations through subtle vocal shifts rather than obvious emphasis, trusting the listener to catch important details.'
        },
        {
          id: 'juliawhelen',
          title: 'Julia Whelan',
          icon: '🔪',
          description: 'Perfectly controlled, intelligent narrator for psychological thrillers',
          instruction: 'Read with Julia Whelan\'s clear, versatile narration style that balances emotional authenticity with restrained performance. Deliver the text with perfect clarity and thoughtful pacing, using subtle vocal shifts to distinguish between characters without overacting. Approach emotional moments with genuine feeling that never becomes melodramatic. Maintain a sophisticated, intelligent tone that honors the text while bringing it vividly to life through precise articulation, natural rhythms, and intuitive emphasis on the right words.'
        },
        {
          id: 'samueljackson',
          title: 'Samuel L. Jackson',
          icon: '⚡',
          description: 'Commanding, intense narrator with electric presence',
          instruction: 'Channel Samuel L. Jackson\'s commanding presence and intense, authoritative delivery. Narrate with confident precision and perfect emphasis on key moments. Use controlled intensity that can escalate to explosive emotion when the story demands it. Deliver dialogue with character-specific rhythms and distinctive vocal qualities. Vary your pacing dramatically - from deliberate, tension-building slowness to rapid-fire delivery during action sequences. Let your voice carry an underlying current of danger at all times, like distant thunder warning of an approaching storm.'
        }
      ]
    }
  ];
  
  // Handle class selection
  const handleSelectClass = (instruction, e) => {
    e.stopPropagation();
    
    if (onSelectNarratorClass) {
      onSelectNarratorClass(instruction);
    }
  };
  
  // Toggle category expand/collapse
  const toggleCategory = (categoryId, e) => {
    e.stopPropagation();
    
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
    }
  };
  
  return (
    <div className="narrator-class-selector">
      <div className="selector-header">
        <h3>Narrator Voice Style Library</h3>
        <p>Choose a professional narrator style for your audio</p>
      </div>
      
      <div className="class-categories">
        {narratorClasses.map(category => (
          <div 
            key={category.id} 
            className="class-category"
            onClick={(e) => toggleCategory(category.id, e)}
          >
            <div className="category-header">
              <div className="category-icon">{category.icon}</div>
              <div className="category-title">{category.title}</div>
            </div>
            
            {selectedCategory === category.id && (
              <div className="class-list">
                {category.classes.map((narratorClass) => (
                  <div 
                    key={narratorClass.id} 
                    className="narrator-class-card"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="class-card-header">
                      <div className="class-icon">{narratorClass.icon}</div>
                      <div className="class-title">{narratorClass.title}</div>
                    </div>
                    <div className="class-description">{narratorClass.description}</div>
                    <button 
                      className="select-class-button"
                      onClick={(e) => handleSelectClass(narratorClass.instruction, e)}
                    >
                      Use This Style
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NarratorClassSelector;