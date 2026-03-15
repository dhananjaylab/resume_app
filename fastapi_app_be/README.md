# Resume Standardizer - FastAPI Backend

A modern, efficient FastAPI backend for resume parsing, standardization, and skill extraction using Google's Gemini 2.0 Flash API.

## Features

- **Resume Parsing**: Upload PDF, DOCX, or PPTX files and extract structured resume data
- **AI-Powered Extraction**: Uses Google Gemini 2.0 Flash for intelligent data extraction
- **Skill Matching**: Compare resume skills against job descriptions
- **DOCX Generation**: Generate formatted Word documents from parsed resume data
- **Async/Non-blocking**: High-performance async implementation using FastAPI
- **Automatic Documentation**: Auto-generated Swagger/OpenAPI docs at `/docs`

## Prerequisites

- Python 3.9+
- A Google Generative AI API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

## Installation

### 1. Clone or Prepare the Project

```bash
cd resume-standardizer-be/fastapi-version
```

### 2. Create Virtual Environment

```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Copy the example environment file and add your API key:

```bash
# Copy example to .env
copy .env.example .env
```

Edit `.env` and add your Gemini API key:

```properties
GEMINI_API_KEY=your_actual_api_key_here
SERVER_HOST=127.0.0.1
SERVER_PORT=8000
```

## Running the Application

### Development Mode (with auto-reload)

```bash
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### Production Mode (without reload)

```bash
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

The API will be available at: `http://127.0.0.1:8000`

### Interactive API Documentation

Access the Swagger UI at: `http://127.0.0.1:8000/docs`

Access the ReDoc documentation at: `http://127.0.0.1:8000/redoc`

## API Endpoints

### 1. Parse Resume
- **Endpoint**: `POST /api/resume/parse`
- **Description**: Upload a resume file and extract structured data
- **Supported Formats**: PDF, DOCX, PPTX (max 10MB)
- **Response**: ResumeData object with parsed information

**Example**:
```bash
curl -X POST "http://127.0.0.1:8000/api/resume/parse" \
  -F "file=@path/to/resume.pdf"
```

### 2. Parse Resume (Formatter Prompt)
- **Endpoint**: `POST /api/resume/parse-raw-resume`
- **Description**: Parse resume using alternative formatter prompt
- **Response**: ResumeData object

### 3. Extract Skills
- **Endpoint**: `POST /api/resume/extract-skills`
- **Description**: Match resume skills against job description
- **Request Body**:
```json
{
  "resume_data": { ... },
  "job_description": "Job description text"
}
```
- **Response**: SkillResponse with matched, required, and resume skills

**Example**:
```bash
curl -X POST "http://127.0.0.1:8000/api/resume/extract-skills" \
  -H "Content-Type: application/json" \
  -d '{
    "resume_data": {...},
    "job_description": "Looking for Python expert with 5+ years experience"
  }'
```

### 4. Download Resume as DOCX
- **Endpoint**: `POST /api/resume/download-resume`
- **Description**: Generate and download a formatted DOCX file
- **Request Body**: ResumeData object
- **Response**: DOCX file with X-Filename header

**Example**:
```bash
curl -X POST "http://127.0.0.1:8000/api/resume/download-resume" \
  -H "Content-Type: application/json" \
  -d '{...resume_data...}' \
  -o resume.docx
```

### 5. Health Check
- **Endpoint**: `GET /api/resume/health`
- **Description**: Check API status
- **Response**: Health status and version

## ResumeData Structure

The API returns parsed resume data in a structured JSON format:

```json
{
  "headers": {
    "name": "John Doe",
    "position": "Senior Software Engineer"
  },
  "professional_summary": "Experienced software engineer...",
  "work_experience": [
    {
      "role": "Senior Engineer",
      "company": "Tech Corp",
      "location": "San Francisco, CA",
      "start_date": "2021-01-01",
      "end_date": "2023-12-31",
      "description": "Led development of...",
      "responsibilities": ["Responsibility 1", "Responsibility 2"]
    }
  ],
  "education": [
    {
      "degree": "BS Computer Science",
      "institution": "University",
      "location": "City, State",
      "start_date": "2017-09-01",
      "end_date": "2021-05-31",
      "courses": ["Course 1", "Course 2"],
      "grades": "3.8 GPA"
    }
  ],
  "certifications": [
    {
      "name": "Certification Name",
      "organization": "Issuer",
      "issue_date": "2023-01-01",
      "expiry_date": "2025-01-01"
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "Project description",
      "details": [
        {"key": "Technology", "value": "Framework"}
      ],
      "responsibilities": ["Achievement 1", "Achievement 2"]
    }
  ],
  "credits": [
    {
      "category": "Languages",
      "items": ["Python", "Java", "JavaScript"]
    }
  ]
}
```

## Configuration

Configuration is managed through environment variables in the `.env` file:

```properties
# API Keys
GEMINI_API_KEY=your_api_key_here

# Server
SERVER_HOST=127.0.0.1
SERVER_PORT=8000
DEBUG=False

# File Upload (in bytes)
MAX_FILE_SIZE=10485760        # 10MB
MAX_REQUEST_SIZE=15728640     # 15MB

# Supported Formats
SUPPORTED_FORMATS=pdf,docx,pptx

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Processing
GEMINI_TEMPERATURE=0.3
```

### Important Security Notes

1. **Never commit `.env` file** to version control - it contains API keys
2. **Keep API keys private** - rotate if accidentally exposed
3. **For production**: Use environment variables instead of .env file
4. **Consider rate limiting** for public deployments

## Project Structure

```
fastapi-version/
├── main.py                    # FastAPI application entry point
├── config.py                  # Configuration management
├── requirements.txt           # Python dependencies
├── .env                       # Environment variables (local dev)
├── .env.example              # Example environment file
│
├── models/
│   ├── resume.py             # Resume data models (Pydantic)
│   └── requests.py           # Request/response models
│
├── services/
│   ├── file_service.py       # File extraction (PDF, DOCX, PPTX)
│   ├── gemini_service.py     # Gemini API wrapper
│   ├── resume_service.py     # Resume parsing orchestration
│   └── docx_service.py       # DOCX generation
│
├── routers/
│   └── resume_router.py      # API endpoint definitions
│
├── exceptions/
│   └── custom_exceptions.py  # Custom exception classes
│
├── utils/
│   ├── constants.py          # Prompts and constants
│   └── file_utils.py         # File handling utilities
│
├── templates/
│   └── Template.docx # DOCX template (optional)
│
└── tests/
    └── (test files here)
```

## Comparing with Original Spring Boot Version

| Aspect | Spring Boot | FastAPI |
|--------|------------|---------|
| Language | Java 17 | Python 3.9+ |
| Framework | Spring Boot 3.4 | FastAPI 0.109 |
| Server | Tomcat | Uvicorn |
| File Extraction | Apache Tika | pypdf, python-docx, python-pptx |
| JSON Validation | Jackson | Pydantic |
| API Client | Custom HTTP | google-generativeai |
| Async | CompletableFuture | async/await |
| Auto Docs | Springdoc OpenAPI | FastAPI (Swagger/ReDoc) |
| DOCX Generation | Apache POI | python-docx |
| Startup Time | ~3-5s | ~1-2s |

## Troubleshooting

### API Key Issues
- Ensure `GEMINI_API_KEY` is set in `.env`
- Verify API key is active in Google AI Studio
- Check for typos or extra whitespace in key

### File Upload Errors
- Maximum file size is 10MB
- Supported formats: PDF, DOCX, PPTX
- Ensure file is not corrupted

### CORS Issues
- Check that frontend URL matches `CORS_ORIGINS` in `.env`
- Ensure `X-Filename` header is in exposed headers list
- Test with curl if frontend shows CORS errors

### Import Errors
- Ensure virtual environment is activated
- Run `pip install -r requirements.txt` again
- Check that Python path includes project root

## Performance Tips

1. **Reuse HTTP Connections**: The Gemini SDK handles connection pooling automatically
2. **Async Benefits**: All file I/O and API calls are non-blocking
3. **Template Caching**: DOCX template is loaded on first request
4. **Response Compression**: GZIP compression is enabled automatically

## Support & Migration Notes

This is a port of the original Spring Boot application to FastAPI. All endpoints and functionality are identical, with the following improvements:

- Faster startup time
- Better async performance
- Simpler Python ecosystem for dependencies
- Native OpenAPI/Swagger documentation
- More intuitive error handling

For questions or issues specific to the original Spring Boot version, refer to the parent directory.

## License

Same as the original Spring Boot application.

## Version History

- **1.0.0** (2024) - Initial FastAPI port from Spring Boot v3.4.4
  - All endpoints migrated
  - Same Gemini API integration
  - Improved async architecture
  - Modern Python best practices
