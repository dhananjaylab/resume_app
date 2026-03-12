@echo off
REM Resume Standardizer FastAPI - Start Script
REM Starts the FastAPI development server

echo.
echo ======================================
echo Resume Standardizer FastAPI
echo ======================================
echo.

REM Check if virtual environment exists
if not exist venv (
    echo ERROR: Virtual environment not found!
    echo Please run setup.bat first to initialize the environment
    pause
    exit /b 1
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Check if .env file has been configured
findstr /L "your_gemini_api_key_here" .env >nul 2>&1
if %errorlevel% equ 0 (
    echo.
    echo WARNING: Gemini API key is not configured!
    echo Please edit .env and add your API key before running the server
    echo.
    echo Get a free API key from: https://makersuite.google.com/app/apikey
    echo.
    pause
    exit /b 1
)

REM Start the server
echo.
echo Starting Resume Standardizer FastAPI server...
echo.
echo Server will be available at: http://127.0.0.1:8000
echo API Documentation at: http://127.0.0.1:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo.

python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000

pause
