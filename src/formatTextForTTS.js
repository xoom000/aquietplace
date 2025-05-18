// formatTextForTTS.js - Convert HTML content to formatted text for TTS

export const formatTextForTTS = (htmlContent) => {
  // Create a temporary div to parse the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  
  // Get custom rules to apply special formatting
  let customRules = [];
  try {
    const stored = localStorage.getItem('customTTSRules');
    if (stored) {
      customRules = JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load custom rules:', e);
  }
  
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
        }
      }
      
      result += childText;
    }
    
    return result;
  };
  
  // Process the entire HTML content
  let formattedText = processNode(tempDiv);
  
  // Apply custom rules to replace patterns in the text
  customRules.forEach(rule => {
    if (rule.pattern) {
      // Escape special regex characters in the pattern
      const escapedPattern = rule.pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Replace the pattern with itself to preserve it (TTS will read based on instructions)
      // You could also wrap it in special markers if needed
      const regex = new RegExp(escapedPattern, 'g');
      formattedText = formattedText.replace(regex, rule.pattern);
    }
  });
  
  // Clean up excessive line breaks
  formattedText = formattedText.replace(/\n{3,}/g, '\n\n');
  
  // Trim whitespace from start and end
  formattedText = formattedText.trim();
  
  return formattedText;
};

// Function to enhance voice instructions based on the reading instructions
export const enhanceVoiceInstructions = (baseInstructions, instructionsJson) => {
  const readingRules = instructionsJson.reading_instructions;
  
  // Get custom rules from localStorage
  let customRules = {};
  try {
    const stored = localStorage.getItem('customTTSRules');
    if (stored) {
      const customRulesList = JSON.parse(stored);
      // Convert array to object format matching instructions.json
      customRulesList.forEach(rule => {
        customRules[rule.pattern] = {
          description: rule.description || rule.name,
          example: rule.example || '',
          how_to_read: rule.how_to_read
        };
      });
    }
  } catch (e) {
    console.error('Failed to load custom rules:', e);
  }
  
  // Merge custom rules with default rules
  const allRules = { ...readingRules, ...customRules };
  
  // Create a comprehensive instruction string
  let enhancedInstructions = baseInstructions || "Read in a natural, engaging tone";
  
  // Add specific punctuation and formatting instructions
  enhancedInstructions += `\n\nAdditional reading guidance:`;
  
  // Add default rules
  if (allRules.comma) enhancedInstructions += `\n- For commas: ${allRules.comma.how_to_read}`;
  if (allRules.em_dash) enhancedInstructions += `\n- For em-dashes (—): ${allRules.em_dash.how_to_read}`;
  if (allRules.ellipsis) enhancedInstructions += `\n- For ellipses (...): ${allRules.ellipsis.how_to_read}`;
  if (allRules.line_break) enhancedInstructions += `\n- For line breaks: ${allRules.line_break.how_to_read}`;
  if (allRules.italics) enhancedInstructions += `\n- For italicized text (*text*): ${allRules.italics.how_to_read}`;
  if (allRules.bold) enhancedInstructions += `\n- For bold text (**text**): ${allRules.bold.how_to_read}`;
  if (allRules.exclamation) enhancedInstructions += `\n- For exclamations: ${allRules.exclamation.how_to_read}`;
  if (allRules.question) enhancedInstructions += `\n- For questions: ${allRules.question.how_to_read}`;
  if (allRules.stretched_words) enhancedInstructions += `\n- For stretched words (like 'nooooo'): ${allRules.stretched_words.how_to_read}`;
  
  // Add custom rules
  Object.keys(customRules).forEach(pattern => {
    const rule = customRules[pattern];
    enhancedInstructions += `\n- For "${pattern}": ${rule.how_to_read}`;
  });
  
  if (allRules.final_tip) {
    enhancedInstructions += `\n${allRules.final_tip}`;
  }
  
  return enhancedInstructions;
};