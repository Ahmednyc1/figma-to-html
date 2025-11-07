# Figma to HTML/CSS Converter

A system that converts Figma designs into HTML/CSS using the Figma REST API and React rendering.

## Overview

This project extracts design data from Figma files via OAuth authentication and renders them as HTML/CSS. It consists of:
- **Backend**: Express server handling Figma OAuth flow and API requests
- **Frontend**: React app that fetches and renders Figma designs

## Prerequisites

- Node.js (v14 or higher)
- Figma account
- Figma OAuth app credentials (Client ID & Client Secret)

## Setup

### 1. Environment Configuration

Create a `.env` file in the `server` directory:
```env
FIGMA_CLIENT_ID=your_client_id_here
FIGMA_CLIENT_SECRET=your_client_secret_here
REDIRECT_URI=http://localhost:3000/callback
```

### 2. Install Dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd client/softlight-engineering-take-home
npm install
```

## Running the Application

### 1. Start the Backend Server
```bash
cd server
npm start
```
Server will run on `http://localhost:4000`

### 2. Start the Frontend
```bash
cd client/softlight-engineering-take-home
npm run dev
```
Frontend will run on `http://localhost:3000`

### 3. Use the Application
1. Open `http://localhost:3000` in your browser
2. Click "Connect Figma" to authenticate
3. The app will fetch and render the Figma design

## How It Works

1. **OAuth Authentication**: User authorizes the app to access their Figma files
2. **Token Exchange**: Backend exchanges OAuth code for access token
3. **Fetch Design Data**: Backend retrieves Figma file JSON using the Figma REST API
4. **Render to HTML/CSS**: React component recursively traverses the design tree and renders each node with appropriate styling

## Project Structure
```
.
├── server/
│   ├── server.js          # Express backend with OAuth & API routes
│   └── .env               # Environment variables
└── client/
    └── softlight-engineering-take-home/
        ├── src/
        │   ├── App.jsx           # Main app component with OAuth button
        │   ├── Callback.jsx      # OAuth callback handler
        │   └── RenderNode.jsx    # Recursive rendering component

```

## Technical Details

### Figma API Integration
- Uses Figma OAuth 2.0 flow
- Fetches file data from `/v1/files/:file_key` endpoint
- Handles authentication tokens securely through backend

### Rendering Logic
The `RenderNode` component:
- Recursively traverses Figma's node tree
- Converts Figma properties to CSS:
  - `absoluteBoundingBox` → `position`, `width`, `height`
  - `fills` → `backgroundColor`, `color`
  - `strokes` → `border`
  - `cornerRadius` → `borderRadius`
  - Text nodes → styled `<div>` elements with proper typography

### Positioning System
- Uses absolute positioning relative to parent containers
- Calculates offsets: `child.x - parent.x`, `child.y - parent.y`
- Handles nested frame structures

## Current Limitations

- Uses inline styles (not separate CSS file)
- Limited support for complex gradients
- No support for images/icons from Figma
- Drop shadows not implemented
- Text with multiple styles not fully supported
- Requires manual re-authentication to change file keys
## Known Issues

- Requires both servers running simultaneously
- OAuth token not persisted (need to re-authenticate each session)
- Some border styles may not render exactly as in Figma

