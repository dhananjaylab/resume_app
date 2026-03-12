"""
FastAPI Resume Standardizer Application
Main entry point for the application.
"""
import io
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.openapi.utils import get_openapi
from config import get_settings
from routers import resume_router
from exceptions.custom_exceptions import ResumeStandardizerException
from models.requests import ErrorResponse

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Resume Standardizer API",
    description="AI-powered resume parsing and skill extraction API powered by Google Gemini",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Get settings
settings = get_settings()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
    expose_headers=["X-Filename"]
)


# Exception handlers
@app.exception_handler(ResumeStandardizerException)
async def resume_standardizer_exception_handler(request, exc: ResumeStandardizerException):
    """Handle custom Resume Standardizer exceptions."""
    logger.error(f"Resume Standardizer Exception: {exc.message}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.__class__.__name__,
            "message": exc.message,
            "status_code": exc.status_code
        }
    )


@app.exception_handler(ValueError)
async def value_error_handler(request, exc: ValueError):
    """Handle validation errors."""
    logger.error(f"Validation Error: {str(exc)}")
    return JSONResponse(
        status_code=422,
        content={
            "error": "Validation Error",
            "message": str(exc),
            "status_code": 422
        }
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc: HTTPException):
    """Handle HTTP exceptions."""
    logger.error(f"HTTP Exception: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": "HTTP Error",
            "message": exc.detail if isinstance(exc.detail, str) else str(exc.detail),
            "status_code": exc.status_code
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc: Exception):
    """Handle all other exceptions."""
    logger.error(f"Unexpected Exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred",
            "status_code": 500
        }
    )


# Include routers
app.include_router(resume_router.router)


# Root endpoint
@app.get(
    "/",
    summary="API Information",
    description="Get information about the API"
)
async def root():
    """Root endpoint returning API information."""
    return {
        "name": "Resume Standardizer API",
        "version": "1.0.0",
        "description": "AI-powered resume parsing and skill extraction",
        "endpoints": {
            "parse": "/api/resume/parse",
            "parse_raw": "/api/resume/parse-raw-resume",
            "extract_skills": "/api/resume/extract-skills",
            "download_resume": "/api/resume/download-resume",
            "health": "/api/resume/health",
            "docs": "/docs"
        }
    }


# Health check endpoint
@app.get(
    "/health",
    summary="Health Check",
    description="Check if the API is running"
)
async def health():
    """Health check endpoint."""
    return {"status": "healthy", "version": "1.0.0"}


# Custom OpenAPI schema
def custom_openapi():
    """Customize OpenAPI schema."""
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Resume Standardizer API",
        version="1.0.0",
        description="AI-powered resume parsing using Google Gemini 2.0 Flash",
        routes=app.routes,
    )
    openapi_schema["info"]["x-logo"] = {
        "url": "https://fastapi.tiangolo.com/img/logo-margin/logo-teal.png"
    }
    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi


# Startup event
@app.on_event("startup")
async def startup_event():
    """Run on application startup."""
    logger.info("Resume Standardizer API starting up")
    logger.info(f"Max file size: {settings.max_file_size / (1024*1024)} MB")


# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Run on application shutdown."""
    logger.info("Resume Standardizer API shutting down")


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host=settings.server_host,
        port=settings.server_port,
        reload=settings.debug,
        log_level="info"
    )
