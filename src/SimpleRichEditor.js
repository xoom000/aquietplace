// SimpleRichEditor.js - Simplified for writers
import React, { useState, useRef, useEffect, useCallback } from 'react';
import './SimpleRichEditor.css';

const SimpleRichEditor = ({ 
  onChange, 
  placeholder, 
  maxChars, 
  hideCharCount = false, 
  onCustomPaste, 
  initialValue,
  syntaxMode = false,
  onSyntaxModeChange
}) => {
  const editorRef = useRef(null);
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);
  const updateTimeoutRef = useRef(null);
  const [isLargeContent, setIsLargeContent] = useState(false);
  const [useTextarea, setUseTextarea] = useState(false);

  // Handle initial content and focus
  useEffect(() => {
    // Check initial content size
    if (initialValue && initialValue.length > 50000) {
      setIsLargeContent(true);
      setUseTextarea(true);
    }
    
    if (editorRef.current) {
      if (initialValue !== undefined) {
        if (useTextarea) {
          editorRef.current.value = initialValue || '';
        } else {
          editorRef.current.innerText = initialValue || '';
        }
        updateCounts(); // Keep immediate update for initial value
        notifyParent(); // Notify parent of initial content
      }
      // Only focus on first load, not on every initialValue change
      if (initialValue === '' || initialValue === undefined) {
        editorRef.current.focus();
      }
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
      const text = useTextarea 
        ? editorRef.current.value || ''
        : editorRef.current.innerText || '';
      const textLength = text.length;
      
      // Check if content is large (over 50k characters)
      const wasLargeContent = isLargeContent;
      setIsLargeContent(textLength > 50000);
      
      // Switch to textarea for large content
      if (textLength > 50000 && !wasLargeContent && !useTextarea) {
        setUseTextarea(true);
      }
      
      setCharCount(textLength);
      
      // Only count words for smaller content to avoid performance issues
      if (textLength < 50000) {
        const words = text.trim().split(/\s+/);
        setWordCount(words.length > 0 && words[0] !== '' ? words.length : 0);
      } else {
        setWordCount(0); // Skip word count for large content
      }
    }
  }, [isLargeContent, useTextarea]);

  // Separate function to notify parent - called with debounce
  const notifyParent = useCallback(() => {
    if (editorRef.current && onChange) {
      const text = useTextarea 
        ? editorRef.current.value || ''
        : editorRef.current.innerText || '';
      const htmlContent = useTextarea ? text : editorRef.current.innerHTML;
      onChange(htmlContent, text);
    }
  }, [onChange, useTextarea]);
  
  // Debounced version for performance with large texts
  const debouncedUpdateCounts = useCallback(() => {
    // Update counts immediately for responsive UI
    updateCounts();
    
    // Clear any existing timeout
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    
    // Debounce parent notification to prevent cursor jumps
    updateTimeoutRef.current = setTimeout(() => {
      notifyParent();
    }, 300); // Debounce parent updates
  }, [updateCounts, notifyParent]);

  // Format functions
  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    debouncedUpdateCounts();
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    // If using textarea, don't handle special formatting shortcuts
    if (useTextarea) {
      return;
    }
    
    // Handle Select All + Delete for large content
    if (e.ctrlKey && e.key === 'a') {
      // When Select All is pressed with large content, prepare for potential delete
      if (isLargeContent) {
        // Set a flag that we're in select-all mode
        editorRef.current.dataset.selectAll = 'true';
      }
    }
    
    // Handle delete/backspace with large content
    if ((e.key === 'Delete' || e.key === 'Backspace') && isLargeContent) {
      const selection = window.getSelection();
      const selectedText = selection.toString();
      
      // If a large amount is selected (more than 10k chars), handle specially
      if (selectedText.length > 10000 || editorRef.current.dataset.selectAll === 'true') {
        e.preventDefault();
        
        // Use a more efficient method for large deletions
        const range = selection.getRangeAt(0);
        range.deleteContents();
        
        // Clear the select-all flag
        delete editorRef.current.dataset.selectAll;
        
        // Immediate update after large deletion
        setTimeout(() => {
          updateCounts();
          notifyParent();
        }, 0);
        return;
      }
    }
    
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

  // Handle pasting with HTML and formatting preservation
  const handlePaste = (e) => {
    // If using textarea, just let the default paste work
    if (useTextarea) {
      if (onCustomPaste) {
        onCustomPaste(e);
      }
      debouncedUpdateCounts();
      return;
    }
    
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
    
    e.preventDefault();
    
    // Try to get HTML content first
    let content = e.clipboardData.getData('text/html');
    
    if (content) {
      // Clean up the HTML to only keep basic formatting
      // Create a temporary div to sanitize the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      
      // Remove any scripts or style tags for security
      const scripts = tempDiv.querySelectorAll('script, style');
      scripts.forEach(script => script.remove());
      
      // Use insertHTML command to preserve formatting
      document.execCommand('insertHTML', false, tempDiv.innerHTML);
    } else {
      // Fallback to plain text if no HTML is available
      const text = e.clipboardData.getData('text/plain');
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
      if (useTextarea) {
        editorRef.current.value = '';
      } else {
        editorRef.current.innerHTML = '';
      }
      updateCounts(); // Keep immediate update for clear action
    }
  };
  
  // Insert (neutral) marker at cursor position
  const insertNeutralMarker = () => {
    if (editorRef.current) {
      if (useTextarea) {
        // For textarea, we need to handle selection manually
        const start = editorRef.current.selectionStart;
        const end = editorRef.current.selectionEnd;
        const text = editorRef.current.value;
        const newText = text.substring(0, start) + "(neutral)" + text.substring(end);
        editorRef.current.value = newText;
        // Set cursor after the inserted text
        editorRef.current.selectionStart = editorRef.current.selectionEnd = start + 9;
      } else {
        // For contenteditable, we can use document.execCommand
        document.execCommand('insertText', false, "(neutral)");
      }
      editorRef.current.focus();
      debouncedUpdateCounts();
    }
  };
  
  // Insert (normal) marker at cursor position
  const insertNormalMarker = () => {
    if (editorRef.current) {
      if (useTextarea) {
        // For textarea, we need to handle selection manually
        const start = editorRef.current.selectionStart;
        const end = editorRef.current.selectionEnd;
        const text = editorRef.current.value;
        const newText = text.substring(0, start) + "(normal)" + text.substring(end);
        editorRef.current.value = newText;
        // Set cursor after the inserted text
        editorRef.current.selectionStart = editorRef.current.selectionEnd = start + 8;
      } else {
        // For contenteditable, we can use document.execCommand
        document.execCommand('insertText', false, "(normal)");
      }
      editorRef.current.focus();
      debouncedUpdateCounts();
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
    <div className={`simple-editor-container ${syntaxMode ? 'syntax-mode' : ''}`}>
      {!useTextarea && (
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
        
        {syntaxMode && (
          <>
            <span className="separator">|</span>
            <button 
              type="button" 
              onClick={insertNeutralMarker} 
              title="Insert (neutral) marker" 
              className="neutral-button"
            >
              Insert (neutral)
            </button>
            <button 
              type="button" 
              onClick={insertNormalMarker} 
              title="Insert (normal) marker" 
              className="normal-button"
            >
              Insert (normal)
            </button>
          </>
        )}
      </div>
      )}
      
      {useTextarea ? (
        <>
          {syntaxMode && (
            <div className="textarea-syntax-toolbar">
              <button 
                type="button" 
                onClick={insertNeutralMarker} 
                title="Insert (neutral) marker"
                className="neutral-button"
              >
                Insert (neutral)
              </button>
              <button 
                type="button" 
                onClick={insertNormalMarker} 
                title="Insert (normal) marker"
                className="normal-button"
              >
                Insert (normal)
              </button>
            </div>
          )}
          <textarea
            className="editor-content editor-textarea"
            ref={editorRef}
            onInput={debouncedUpdateCounts}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder={placeholder || "Begin your story here..."}
          />
        </>
      ) : (
        <div 
          className="editor-content" 
          ref={editorRef}
          contentEditable="true"
          onInput={debouncedUpdateCounts}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          data-placeholder={placeholder || "Begin your story here..."}
        />
      )}
      
      <div className="editor-footer">
        <div className="count-info">
          {!hideCharCount && (
            <span className={charCount > maxChars ? 'exceeds-limit' : ''}>
              Characters: {charCount}{maxChars ? ` / ${maxChars}` : ''}
            </span>
          )}
          <span>Words: {wordCount > 0 ? wordCount : (isLargeContent ? '(large content)' : '0')}</span>
          {isLargeContent && (
            <span style={{ marginLeft: '10px', color: '#ff9800' }}>
              ⚠️ Large content mode
            </span>
          )}
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
