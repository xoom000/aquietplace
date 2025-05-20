// formatTextForTTS.js - Convert HTML content to formatted text for TTS

export const formatTextForTTS = (htmlContent) => {
  // Create a temporary div to parse the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  
  // Function to recursively process nodes
  const processNode = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent;
    }
    
    let result = '';
    
    // Process child nodes
    for (const child of node.childNodes) {
      let childText = processNode(child);
      
      // Apply formatting based on node type
      if (child.nodeType === Node.ELEMENT_NODE) {
        const tagName = child.tagName.toLowerCase();
        
        switch (tagName) {
          case 'strong':
          case 'b':
            // Bold text - wrap in double asterisks
            childText = `**${childText}**`;
            break;
          case 'em':
          case 'i':
            // Italic text - wrap in single asterisks
            childText = `*${childText}*`;
            break;
          case 'u':
            // Underline - no specific markdown, but we can use underscore
            childText = `_${childText}_`;
            break;
          case 'br':
            // Line break
            childText = '\n';
            break;
          case 'p':
            // Paragraph - add double line break after
            childText = childText + '\n\n';
            break;
          case 'h1':
          case 'h2':
          case 'h3':
            // Headers - add line breaks before and after
            childText = '\n\n' + childText + '\n\n';
            break;
          case 'li':
            // List items - add bullet or number
            const parent = child.parentNode;
            if (parent.tagName.toLowerCase() === 'ul') {
              childText = '• ' + childText + '\n';
            } else if (parent.tagName.toLowerCase() === 'ol') {
              const index = Array.from(parent.children).indexOf(child) + 1;
              childText = `${index}. ` + childText + '\n';
            }
            break;
          // Special handling for syntax tags would go here if needed
        }
      }
      
      result += childText;
    }
    
    return result;
  };
  
  // Process the entire HTML content
  let formattedText = processNode(tempDiv);
  
  // Clean up excessive line breaks
  formattedText = formattedText.replace(/\n{3,}/g, '\n\n');
  
  // Process any emotional syntax tags
  // This regex will match patterns like [emotion:anger], [tone:sarcastic], etc.
  formattedText = formattedText.replace(/\[(emotion|tone|emphasis|voice|pace|volume):([^\]]+)\](.*?)\[\/(emotion|tone|emphasis|voice|pace|volume)\]/g, 
    (match, type, value, content) => {
      // For the TTS API, we'll translate these tags into natural language instructions
      // within the content to guide the voice model
      switch(type) {
        case 'emotion':
          return `(${value}) ${content} (neutral)`;
        case 'tone':
          return `(in a ${value} tone) ${content} (back to normal)`;
        case 'emphasis':
          return `(${value} emphasis) ${content} (normal emphasis)`;
        case 'voice':
          return `(${value} voice) ${content} (normal voice)`;
        case 'pace':
          return `(${value} pace) ${content} (normal pace)`;
        case 'volume':
          return `(${value} volume) ${content} (normal volume)`;
        default:
          return content;
      }
    }
  );
  
  // Trim whitespace from start and end
  formattedText = formattedText.trim();
  
  return formattedText;
};

// Function to enhance voice instructions based on the reading instructions
export const enhanceVoiceInstructions = (baseInstructions, instructionsJson, withDynamicInflection = false) => {
  const readingRules = instructionsJson.reading_instructions;
  
  // Create a comprehensive instruction string
  let enhancedInstructions = baseInstructions || "Read in a natural, engaging tone";
  
  // Add dynamic inflection instructions if enabled
  if (withDynamicInflection) {
    enhancedInstructions += `\n\nDynamic inflection guidance:
- Pay special attention to emotional transitions in the text
- When moving from a happy scene to a fearful one, gradually shift your tone
- For dialogue between different emotional states, adjust your inflection to match
- Maintain context awareness across paragraph boundaries
- In first-person narration, embody the emotions as they develop
- When humor transitions to seriousness, subtly shift your tone to reflect this
- Connect related emotional content even when separated by description`;
  }
  
  // Add specific punctuation and formatting instructions
  enhancedInstructions += `\n\nAdditional reading guidance:`;
  
  // Add default rules
  if (readingRules.comma) enhancedInstructions += `\n- For commas: ${readingRules.comma.how_to_read}`;
  if (readingRules.em_dash) enhancedInstructions += `\n- For em-dashes (—): ${readingRules.em_dash.how_to_read}`;
  if (readingRules.ellipsis) enhancedInstructions += `\n- For ellipses (...): ${readingRules.ellipsis.how_to_read}`;
  if (readingRules.line_break) enhancedInstructions += `\n- For line breaks: ${readingRules.line_break.how_to_read}`;
  if (readingRules.italics) enhancedInstructions += `\n- For italicized text (*text*): ${readingRules.italics.how_to_read}`;
  if (readingRules.bold) enhancedInstructions += `\n- For bold text (**text**): ${readingRules.bold.how_to_read}`;
  if (readingRules.exclamation) enhancedInstructions += `\n- For exclamations: ${readingRules.exclamation.how_to_read}`;
  if (readingRules.question) enhancedInstructions += `\n- For questions: ${readingRules.question.how_to_read}`;
  if (readingRules.stretched_words) enhancedInstructions += `\n- For stretched words (like 'nooooo'): ${readingRules.stretched_words.how_to_read}`;
  
  if (readingRules.final_tip) {
    enhancedInstructions += `\n${readingRules.final_tip}`;
  }
  
  return enhancedInstructions;
};