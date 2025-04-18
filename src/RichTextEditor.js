// First, install the required packages:
// npm install react-quill quill-paste-smart quill-blot-formatter

// RichTextEditor.js - A modern rich text editor component
import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'quill-paste-smart';
import BlotFormatter from 'quill-blot-formatter';
import './RichTextEditor.css';

// Register the Blot formatter module
ReactQuill.Quill.register('modules/blotFormatter', BlotFormatter);

const RichTextEditor = ({ value, onChange, placeholder, maxChars }) => {
  const [editorValue, setEditorValue] = useState(value || '');
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  
  // Update character and word count
  useEffect(() => {
    if (editorValue) {
      // Strip HTML tags to count only visible text
      const textOnly = editorValue.replace(/<[^>]*>/g, '');
      setCharCount(textOnly.length);
      
      // Count words
      const words = textOnly.trim().split(/\s+/);
      setWordCount(words.length > 0 && words[0] !== '' ? words.length : 0);
    } else {
      setCharCount(0);
      setWordCount(0);
    }
  }, [editorValue]);
  
  // Handle editor change
  const handleChange = (content) => {
    setEditorValue(content);
    if (onChange) {
      onChange(content);
    }
  };
  
  // Formats allowed in the editor
  const formats = [
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'link', 'blockquote', 'code-block',
    'header', 'align', 'color', 'background'
  ];
  
  // Module configurations
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'blockquote', 'code-block'],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
      // Enable smart paste handler from quill-paste-smart
      allowed: {
        tags: ['a', 'b', 'strong', 'u', 'i', 'p', 'br', 'ul', 'ol', 'li', 'span'],
        attributes: ['href', 'rel', 'target', 'class']
      }
    },
    blotFormatter: {},
    keyboard: {
      bindings: {
        tab: false 
      }
    }
  };
  
  return (
    <div className="rich-text-editor-container">
      <ReactQuill
        theme="snow"
        value={editorValue}
        onChange={handleChange}
        formats={formats}
        modules={modules}
        placeholder={placeholder || "Enter your text here..."}
      />
      <div className="editor-stats">
        <div className="count-info">
          <span className={charCount > maxChars ? 'exceeds-limit' : ''}>
            Characters: {charCount}{maxChars ? ` / ${maxChars}` : ''}
          </span>
          <span>Words: {wordCount}</span>
        </div>
        <div className="editor-actions">
          <button 
            className="clear-button" 
            onClick={() => handleChange('')}
            type="button"
          >
            Clear Text
          </button>
          <button 
            className="to-plain-text" 
            onClick={() => {
              // Convert to plain text
              const textOnly = editorValue.replace(/<[^>]*>/g, '');
              handleChange(textOnly);
            }}
            type="button"
          >
            Convert to Plain Text
          </button>
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;
