@echo off
REM Resume Standardizer FastAPI - Setup Script for Windows
REM This script sets up the Python virtual environment and installs dependencies

echo.
echo ======================================
echo Resume Standardizer FastAPI Setup
echo ======================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.9+ from https://www.python.org/
    echo Make sure to check "Add Python to PATH" during installation
    pause
    exit /b 1
)

echo Python found. Version info:
python --version
echo.

REM Create virtual environment
echo Creating virtual environment...
if not exist venv (
    python -m venv venv
    if %errorlevel% neq 0 (
        echo ERROR: Failed to create virtual environment
        pause
        exit /b 1
    )
    echo Virtual environment created successfully!
) else (
    echo Virtual environment already exists
)
echo.

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat
if %errorlevel% neq 0 (
    echo ERROR: Failed to activate virtual environment
    pause
    exit /b 1
)
echo Virtual environment activated!
echo.

REM Upgrade pip
echo Upgrading pip...
python -m pip install --upgrade pip
echo.

REM Install requirements
echo Installing requirements...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: Failed to install requirements
    pause
    exit /b 1
)
echo Requirements installed successfully!
echo.

REM Configure .env file
echo.
echo ======================================
echo Configuration Setup
echo ======================================
echo.
echo Please add your Gemini API key to the .env file:
echo.
echo 1. Open .env in a text editor
echo 2. Replace "your_gemini_api_key_here" with your actual API key
echo 3. Save the file
echo.
echo You can get a free API key from: https://makersuite.google.com/app/apikey
echo.
pause

REM Show next steps
echo.
echo ======================================
echo Setup Complete!
echo ======================================
echo.
echo Next steps:
echo 1. Configure your Gemini API key in .env file
echo 2. Run: start.bat (to start the development server)
echo 3. Open http://127.0.0.1:8000/docs in your browser
echo.
pause
