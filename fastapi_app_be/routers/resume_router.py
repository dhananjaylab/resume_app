"""
API Router for resume endpoints.
Defines all resume-related API endpoints.
"""
import io
from typing import Optional
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from models.resume import ResumeData
from models.requests import SkillRequest, SkillResponse
from services import resume_service
from services import docx_service
from exceptions.custom_exceptions import (
    ResumeStandardizerException,
    FileProcessingException,
    GeminiAPIException
)

router = APIRouter(prefix="/api/resume", tags=["resume"])


@router.post(
    "/parse",
    response_model=ResumeData,
    response_model_by_alias=False,
    summary="Parse Resume File",
    description="Upload a resume file (PDF, DOCX, or PPTX) and receive structured resume data"
)
async def parse_resume(file: UploadFile = File(..., description="Resume file to parse")):
    """
    Parse an uploaded resume file and extract structured data.
    
    Supported formats:
    - PDF (.pdf)
    - Word Documents (.docx, .doc)
    - PowerPoint Presentations (.pptx, .ppt)
    
    Maximum file size: 10MB
    
    Returns structured resume data with:
    - Headers (name, position)
    - Professional summary
    - Work experience
    - Education
    - Certifications
    - Projects
    - Credits (skills, languages, etc.)
    """
    resume_data = await resume_service.extract_resume_data(file)
    return resume_data


@router.post(
    "/parse-raw-resume",
    response_model=ResumeData,
    response_model_by_alias=True,
    summary="Parse Resume with Formatter Prompt",
    description="Upload a resume file and parse using an alternative formatter prompt"
)
async def parse_raw_resume(file: UploadFile = File(..., description="Resume file to parse")):
    """
    Parse resume using alternative formatter prompt.
    Provides a different parsing approach that may work better for certain resume formats.
    
    This endpoint uses a raw formatter prompt instead of the standard resume extraction prompt.
    Result format is identical to /parse endpoint.
    """
    resume_data = await resume_service.extract_raw_with_formatter_prompt(file)
    return resume_data


@router.post(
    "/extract-skills",
    response_model=SkillResponse,
    summary="Extract and Match Skills",
    description="Compare resume skills against job description requirements"
)
async def extract_skills(skill_request: SkillRequest):
    """
    Extract and match skills from resume against job description.
    
    Request body should contain:
    - resume_data: The parsed resume data (from /parse endpoint)
    - job_description: The job description text to match skills against
    
    Returns:
    - resume_skills: All skills found in the resume
    - required_skills: All skills mentioned in the job description
    - matched_skills: Skills that appear in both resume and job description
    
    All skill lists are sorted alphabetically and deduplicated.
    """
    if not skill_request.job_description:
        raise ValueError("Job description is required")
    
    skill_response = await resume_service.extract_skills(
        skill_request.resume_data,
        skill_request.job_description
    )
    return skill_response


@router.post(
    "/download-resume",
    summary="Download Resume as DOCX",
    description="Generate and download a formatted DOCX file from resume data"
)
async def download_resume(resume_data: ResumeData):
    """
    Generate a formatted DOCX file from resume data and return it as a download.
    
    The generated document includes:
    - Formatted headers with candidate name and position
    - Professional summary
    - Work experience with responsibilities
    - Education and certifications
    - Project details
    - Skills and competencies
    
    The filename is generated from the candidate's name and position.
    The X-Filename header exposes the generated filename.
    """
    if not resume_data.headers or not resume_data.headers.candidateName:
        raise ValueError("Resume must contain name in headers")
    
    doc_bytes, filename = await docx_service.download_resume(resume_data)
    
    return StreamingResponse(
        iter([doc_bytes]),
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


@router.get(
    "/health",
    summary="Health Check",
    description="Check if the API is running and healthy"
)
async def health_check():
    """
    Health check endpoint to verify the API is running.
    Returns status and version information.
    """
    return {
        "status": "healthy",
        "version": "1.0.0",
        "service": "Resume Standardizer API"
    }
