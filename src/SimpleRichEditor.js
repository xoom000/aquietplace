// SimpleRichEditor.js - Simplified for writers
import React, { useState, useRef, useEffect, useCallback } from 'react';
// No need to import CSS as styles are included in App.css now

const SimpleRichEditor = ({ onChange, placeholder, maxChars, hideCharCount = false, onCustomPaste, initialValue }) => {
  const editorRef = useRef(null);
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);
  const updateTimeoutRef = useRef(null);

  // Handle initial content and focus
  useEffect(() => {
    if (editorRef.current) {
      if (initialValue !== undefined) {
        editorRef.current.innerText = initialValue || '';
        updateCounts(); // Keep immediate update for initial value
      }
      editorRef.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  // Update character and word count
  const updateCounts = useCallback(() => {
    if (editorRef.current) {
      const text = editorRef.current.innerText || '';
      setCharCount(text.length);
      
      // Count words
      const words = text.trim().split(/\s+/);
      setWordCount(words.length > 0 && words[0] !== '' ? words.length : 0);
      
      // Pass content to parent component
      if (onChange) {
        // Get HTML content
        const htmlContent = editorRef.current.innerHTML;
        // Get plain text
        const plainText = text;
        onChange(htmlContent, plainText);
      }
    }
  }, [onChange]);
  
  // Debounced version for performance with large texts
  const debouncedUpdateCounts = useCallback(() => {
    // Clear any existing timeout
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    
    // Set a new timeout
    updateTimeoutRef.current = setTimeout(() => {
      updateCounts();
    }, 100); // 100ms delay
  }, [updateCounts]);

  // Format functions
  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    debouncedUpdateCounts();
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    // Bold: Ctrl+B
    if (e.ctrlKey && e.key === 'b') {
      e.preventDefault();
      formatText('bold');
    }
    // Italic: Ctrl+I
    else if (e.ctrlKey && e.key === 'i') {
      e.preventDefault();
      formatText('italic');
    }
    // Underline: Ctrl+U
    else if (e.ctrlKey && e.key === 'u') {
      e.preventDefault();
      formatText('underline');
    }
  };

  // Handle pasting to strip unwanted formatting
  const handlePaste = (e) => {
    // If there's a custom paste handler provided, call it first
    if (onCustomPaste) {
      // Let the custom handler decide whether to preventDefault
      onCustomPaste(e);
      
      // If the default was already prevented, return early or continue based on handler
      if (e.defaultPrevented) {
        debouncedUpdateCounts();
        return;
      }
    }
    
    // Only prevent default if we're stripping formatting ourselves
    // If a custom handler was provided and didn't prevent default, allow normal paste
    if (!onCustomPaste) {
      e.preventDefault();
      
      // Get text from clipboard
      const text = e.clipboardData.getData('text/plain');
      
      // Insert text at cursor position
      document.execCommand('insertText', false, text);
    }
    
    debouncedUpdateCounts();
  };

  // Toggle toolbar visibility
  const toggleToolbar = () => {
    setIsToolbarVisible(!isToolbarVisible);
  };

  // Clear all text
  const clearText = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = '';
      updateCounts(); // Keep immediate update for clear action
    }
  };

  // Convert to plain text (remove formatting)
  const convertToPlainText = () => {
    if (editorRef.current) {
      const plainText = editorRef.current.innerText || '';
      editorRef.current.innerHTML = plainText;
      updateCounts(); // Keep immediate update for convert action
    }
  };

  return (
    <div className="simple-editor-container">
      <div className={`editor-toolbar ${isToolbarVisible ? 'visible' : ''}`}>
        <button type="button" onClick={() => formatText('bold')} title="Bold (Ctrl+B)">
          <strong>B</strong>
        </button>
        <button type="button" onClick={() => formatText('italic')} title="Italic (Ctrl+I)">
          <em>I</em>
        </button>
        <button type="button" onClick={() => formatText('underline')} title="Underline (Ctrl+U)">
          <u>U</u>
        </button>
        <span className="separator">|</span>
        <button type="button" onClick={() => formatText('insertOrderedList')} title="Numbered List">
          1.
        </button>
        <button type="button" onClick={() => formatText('insertUnorderedList')} title="Bullet List">
          •
        </button>
        <span className="separator">|</span>
        <button type="button" onClick={() => formatText('formatBlock', '<h1>')} title="Chapter Title">
          Title
        </button>
        <button type="button" onClick={() => formatText('formatBlock', '<h2>')} title="Section Title">
          Heading
        </button>
        <button type="button" onClick={() => formatText('formatBlock', '<p>')} title="Paragraph">
          Text
        </button>
      </div>
      
      <div 
        className="editor-content" 
        ref={editorRef}
        contentEditable="true"
        onInput={debouncedUpdateCounts}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        data-placeholder={placeholder || "Begin your story here..."}
      />
      
      <div className="editor-footer">
        <div className="count-info">
          {!hideCharCount && (
            <span className={charCount > maxChars ? 'exceeds-limit' : ''}>
              Characters: {charCount}{maxChars ? ` / ${maxChars}` : ''}
            </span>
          )}
          <span>Words: {wordCount}</span>
        </div>
        <div className="editor-actions">
          <button 
            type="button" 
            onClick={toggleToolbar} 
            className="toggle-button"
          >
            {isToolbarVisible ? 'Hide Formatting' : 'Show Formatting'}
          </button>
          <button type="button" onClick={clearText}>Clear All</button>
        </div>
      </div>
    </div>
  );
};

export default SimpleRichEditor;
