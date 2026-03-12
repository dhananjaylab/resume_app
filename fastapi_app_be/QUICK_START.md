# Quick Start Guide - Resume Standardizer FastAPI

Get your Resume Standardizer API running in 5 minutes!

## Prerequisites

- **Python 3.9+** - [Download from python.org](https://www.python.org/)
- **Gemini API Key** - [Get free key from Google AI Studio](https://makersuite.google.com/app/apikey)

## Quick Setup (Windows)

### Step 1: Run Setup Script
Double-click `setup.bat` - this will:
- Create a Python virtual environment
- Install all required dependencies
- Guide you to configure the API key

### Step 2: Configure API Key
1. Open `.env` file in any text editor
2. Replace `your_gemini_api_key_here` with your actual Gemini API key
3. Save the file

### Step 3: Start the Server
Double-click `start.bat` - you should see:
```
Starting Resume Standardizer FastAPI server...
Server will be available at: http://127.0.0.1:8000
API Documentation at: http://127.0.0.1:8000/docs
```

### Step 4: Test the API
Open your browser and go to: **http://127.0.0.1:8000/docs**

You'll see the interactive Swagger UI where you can test all endpoints!

---

## Manual Setup (macOS/Linux or without batch files)

### 1. Create Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure API Key
Edit `.env` and add your Gemini API key:
```
GEMINI_API_KEY=your_actual_key_here
```

### 4. Start Server
```bash
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

---

## Testing the API

### Using Swagger UI (Recommended)
1. Go to: http://127.0.0.1:8000/docs
2. Click on any endpoint (e.g., `/api/resume/parse`)
3. Click **Try it out**
4. Upload a resume file or enter test data
5. Click **Execute**

### Using curl Command Line

**Parse a Resume:**
```bash
curl -X POST "http://127.0.0.1:8000/api/resume/parse" \
  -F "file=@C:\path\to\resume.pdf"
```

**Extract Skills:**
```bash
curl -X POST "http://127.0.0.1:8000/api/resume/extract-skills" \
  -H "Content-Type: application/json" \
  -d "{\"resume_data\": {...}, \"job_description\": \"...\"}"
```

**Download DOCX:**
```bash
curl -X POST "http://127.0.0.1:8000/api/resume/download-resume" \
  -H "Content-Type: application/json" \
  -d "{...resume_data...}" \
  -o resume.docx
```

### Using Python Script

```python
import requests

# Test API health
response = requests.get("http://127.0.0.1:8000/health")
print(response.json())

# Parse resume
with open("resume.pdf", "rb") as f:
    response = requests.post(
        "http://127.0.0.1:8000/api/resume/parse",
        files={"file": f}
    )
    resume_data = response.json()
    print(resume_data)
```

---

## Troubleshooting

### "Python was not found"
- **Windows**: Python is not in your PATH
  - Reinstall Python and **check "Add Python to PATH"**
  - Restart your computer after installing

- **macOS/Linux**: Try `python3` instead of `python`

### "Module not found" errors
- Ensure virtual environment is activated
- Run `pip install -r requirements.txt` again
- Check that you're in the right directory

### "Gemini API Error"
- Verify API key is in `.env` file
- Make sure the key is correct (no extra spaces)
- Check that your API key is active in Google AI Studio
- Visit: https://makersuite.google.com/app/apikey

### CORS Errors (if using with frontend)
- Edit `.env` and update `CORS_ORIGINS` to include your frontend URL
- Example: `CORS_ORIGINS=http://localhost:5173,http://localhost:3000`

### "File does not compile" errors
- Ensure Python version is 3.9+
- Run `pip install -r requirements.txt` again to ensure all deps are installed

---

## Next Steps

1. **Read the Full Documentation**: See [README.md](README.md) for complete API documentation
2. **Test All Endpoints**: Visit `/docs` to try all available endpoints
3. **Integrate with Frontend**: Update frontend CORS settings if needed
4. **Deploy**: See README.md for production deployment instructions

---

## File Structure

```
fastapi-version/
├── main.py                  ← Application entry point
├── config.py               ← Configuration (reads from .env)
├── requirements.txt        ← Python dependencies
├── .env                    ← Your API key (edit this!)
├── setup.bat              ← Run once to setup
├── start.bat              ← Run to start server
│
├── models/                ← Data structures
├── services/              ← Business logic
├── routers/               ← API endpoints
├── exceptions/            ← Error handling
├── utils/                 ← Helper functions
└── templates/             ← DOCX template
```

---

## Support

- **API Docs**: http://127.0.0.1:8000/docs
- **Alternative Docs**: http://127.0.0.1:8000/redoc
- **GitHub Issues**: (See parent project)

---

## For Spring Boot Users

Migrating from the original Spring Boot version? Good news - **all endpoints work the same**!

| Spring Boot | FastAPI |
|------------|---------|
| POST `/api/resume/parse` | ✅ Same |
| POST `/api/resume/parse-raw-resume` | ✅ Same |
| POST `/api/resume/extract-skills` | ✅ Same |
| POST `/api/resume/download-resume` | ✅ Same |

Just use the FastAPI URLs instead - same request/response formats!

---

**Enjoy your Resume Standardizer API! 🚀**
