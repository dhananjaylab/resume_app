# AI Resume Builder - React Frontend

A modern, high-performance React application built with Vite and TailwindCSS for editing and generating standardized resumes.

## Features

- **Real-time Editor**: Modify your resume data with a live-syncing interface.
- **AI-Powered Parsing**: Integrated with the FastAPI backend for intelligent resume extraction.
- **Premium DOCX Export**: Generate "invincible" Word documents that are 100% compatible with Microsoft Word.
- **Branded Header**: Automated branding with the Maveric Systems logo and decorative sidebar.
- **High-Fidelity Preview**: Visual representation of exactly how the final resume will look.

## Prerequisites

- Node.js 18+
- npm 9+

## Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and adjust the backend API URL if needed:
```bash
cp .env.example .env
```

### 3. Run Development Server
```bash
npm run dev
```

The application will be available at: `http://localhost:5173/frontend/`

## Deployment

### Build for Production
```bash
npm run build
```
The optimized build will be generated in the `dist` directory.

## Key Technologies
- **Vite**: Ultra-fast build tool and dev server.
- **React**: Component-based UI library.
- **TailwindCSS**: Utility-first CSS framework.
- **Docx.js**: Robust library for generating DOCX files directly in the browser.
