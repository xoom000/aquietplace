# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Quiet Place is a React application for creating audio narrations of stories and written content using OpenAI's text-to-speech API. The application features a forest-themed UI with animations and provides two main modes:

1. **Creative Corner** - For shorter texts with a simple textarea interface
2. **Book Studio** - For longer manuscripts with a rich text editor

## Commands

### Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## Architecture

### Core Components

- **App.js**: Main component that handles application state and mode switching
- **SimpleRichEditor.js**: Rich text editor used in Book Studio mode
- **VoiceInstructionsGuide.js**: Component for selecting voice style presets
- **ForestAnimations.js**: Handles the forest theme animations (leaves, fireflies, etc.)

### Key Features

1. **Text-to-Speech Integration**
   - Uses OpenAI's text-to-speech API (requires user's API key)
   - Supports multiple voice options and custom voice instructions
   - Handles text splitting for longer content to work with API character limits

2. **Two Usage Modes**
   - Creative Corner: Simple text input for quick experiments
   - Book Studio: Rich text editor with text processing into multiple sections

3. **Voice Styling**
   - Extensive voice styling options organized by categories
   - Predefined combinations for common storytelling styles

4. **Forest Theme**
   - Animated UI elements including falling leaves and fireflies
   - Forest animal silhouettes and ambient lighting effects

## Implementation Details

1. **API Key Management**
   - Stored in localStorage for persistence
   - Clients manage their own OpenAI API keys

2. **Text Processing**
   - Long texts are split into sections to handle API character limits
   - Rich text editing supports basic formatting (bold, italic, lists)

3. **Voice Instructions**
   - Structured into categories (emotional tone, pacing, character types)
   - Preset combinations for quick selection