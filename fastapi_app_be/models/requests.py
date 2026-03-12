"""
Request and response models for API endpoints.
"""
from pydantic import BaseModel, Field
from typing import List, Optional
from .resume import ResumeData


class SkillRequest(BaseModel):
    """Request to extract and match skills."""
    resume_data: ResumeData = Field(..., description="Parsed resume data")
    job_description: str = Field(..., description="Job description to match skills against")
    
    class Config:
        json_schema_extra = {
            "example": {
                "resume_data": {},
                "job_description": "Looking for Python expert with 5+ years experience"
            }
        }


class SkillResponse(BaseModel):
    """Response with matched, required, and resume skills."""
    resume_skills: List[str] = Field(default_factory=list, description="Skills found in resume")
    required_skills: List[str] = Field(default_factory=list, description="Skills required by job")
    matched_skills: List[str] = Field(default_factory=list, description="Skills matching both resume and job")
    
    class Config:
        json_schema_extra = {
            "example": {
                "resume_skills": ["Python", "FastAPI", "PostgreSQL"],
                "required_skills": ["Python", "Django", "AWS"],
                "matched_skills": ["Python"]
            }
        }


class ErrorResponse(BaseModel):
    """Standard error response format."""
    error: str = Field(..., description="Error type")
    message: str = Field(..., description="Error message")
    status_code: int = Field(..., description="HTTP status code")
    
    class Config:
        json_schema_extra = {
            "example": {
                "error": "Validation Error",
                "message": "File size exceeds maximum allowed size",
                "status_code": 413
            }
        }


class HealthResponse(BaseModel):
    """Health check response."""
    status: str = Field(default="healthy", description="Application status")
    version: str = Field(default="1.0.0", description="API version")
    
    class Config:
        json_schema_extra = {
            "example": {
                "status": "healthy",
                "version": "1.0.0"
            }
        }
