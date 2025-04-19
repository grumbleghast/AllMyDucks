import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import './RichTextEditor.css';

/**
 * RichTextEditor component
 * Provides rich text editing capabilities for task content
 * @param {Object} props - Component props
 * @param {string} props.value - Current content value
 * @param {function} props.onChange - Function to call when content changes
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.readOnly - Whether editor is read-only
 * @returns {JSX.Element} The rendered component
 */
const RichTextEditor = ({ value, onChange, placeholder = 'Enter text...', readOnly = false }) => {
  const [showToolbar, setShowToolbar] = useState(false);
  
  // Text formatting functions
  const applyFormatting = (command, value = null) => {
    document.execCommand(command, false, value);
    const selection = document.getSelection();
    const container = document.getElementById('rich-text-editor');
    
    // Keep focus on editor after formatting
    if (selection.rangeCount) {
      const range = selection.getRangeAt(0);
      if (container.contains(range.commonAncestorContainer)) {
        container.focus();
      }
    }
  };
  
  // Handle content changes
  const handleInput = (e) => {
    if (onChange) {
      onChange(e.target.innerHTML);
    }
  };
  
  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    // Bold: Ctrl+B
    if (e.ctrlKey && e.key === 'b') {
      e.preventDefault();
      applyFormatting('bold');
    }
    // Italic: Ctrl+I
    else if (e.ctrlKey && e.key === 'i') {
      e.preventDefault();
      applyFormatting('italic');
    }
    // Underline: Ctrl+U
    else if (e.ctrlKey && e.key === 'u') {
      e.preventDefault();
      applyFormatting('underline');
    }
  };
  
  // Handle emoji selection
  const insertEmoji = (emoji) => {
    applyFormatting('insertText', emoji);
  };
  
  // Common emojis
  const emojis = ['😀', '😊', '👍', '🎉', '⭐', '🔥', '⚡', '❗', '❓', '⏰'];
  
  // Text color options
  const colors = [
    { name: 'Black', value: '#000000' },
    { name: 'Red', value: '#ff0000' },
    { name: 'Green', value: '#00ff00' },
    { name: 'Blue', value: '#0000ff' },
    { name: 'Purple', value: '#800080' },
    { name: 'Orange', value: '#ffa500' }
  ];
  
  return (
    <div className="rich-text-editor-container">
      {/* Editor toolbar - shown when editor is focused */}
      {showToolbar && !readOnly && (
        <div className="editor-toolbar">
          <button 
            type="button" 
            onClick={() => applyFormatting('bold')}
            className="toolbar-btn"
            title="Bold (Ctrl+B)"
          >
            <strong>B</strong>
          </button>
          <button 
            type="button" 
            onClick={() => applyFormatting('italic')}
            className="toolbar-btn"
            title="Italic (Ctrl+I)"
          >
            <em>I</em>
          </button>
          <button 
            type="button" 
            onClick={() => applyFormatting('underline')}
            className="toolbar-btn"
            title="Underline (Ctrl+U)"
          >
            <u>U</u>
          </button>
          
          {/* Color picker */}
          <Form.Select 
            className="color-picker"
            onChange={(e) => applyFormatting('foreColor', e.target.value)}
            value=""
            title="Text Color"
          >
            <option value="" disabled>Color</option>
            {colors.map((color) => (
              <option key={color.value} value={color.value}>
                {color.name}
              </option>
            ))}
          </Form.Select>
          
          {/* Emoji picker */}
          <div className="emoji-picker">
            {emojis.map((emoji) => (
              <button 
                key={emoji}
                type="button" 
                onClick={() => insertEmoji(emoji)}
                className="emoji-btn"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Editable content area */}
      <div
        id="rich-text-editor"
        className="rich-text-editor"
        contentEditable={!readOnly}
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={handleInput}
        onFocus={() => setShowToolbar(true)}
        onBlur={() => setTimeout(() => setShowToolbar(false), 200)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        suppressContentEditableWarning={true}
      />
    </div>
  );
};

export default RichTextEditor; 