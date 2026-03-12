# AI-Powered Resume Builder

A professional resume building application with an AI-integrated backend and a modern React frontend.

## Project Structure

- `fastapi_app_be/`: Python FastAPI backend for AI processing and parsing.
- `react_fe/`: React (Vite) frontend for editing and generating DOCX resumes.

## Quick Start

### 1. Backend Setup
```bash
cd fastapi_app_be
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
# Install dependencies
pip install -r requirements.txt
# Run the server
uvicorn main:app --reload
```

### 2. Frontend Setup
```bash
cd react_fe
# Install dependencies
npm install
# Run dev server
npm run dev
```

## Production Readiness
- **Environment Variables**: Copy `.env.example` to `.env` in both directories and fill in your keys.
- **DOCX Stability**: The generator uses a schema-hardened flat table structure to ensure 100% compatibility with Microsoft Word.
