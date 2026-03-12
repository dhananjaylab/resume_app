"""
Pydantic models for Resume Standardizer application.
Main data structures for resume data.
"""
from pydantic import BaseModel, Field, field_validator, ConfigDict
from typing import List, Optional
from datetime import date


class Headers(BaseModel):
    """Header information (candidate name and position)."""
    candidateName: Optional[str] = Field(None, alias="name")
    candidatePosition: Optional[str] = Field(None, alias="position")
    
    model_config = ConfigDict(
        populate_by_name=True,
        json_schema_extra={
            "example": {
                "candidateName": "John Doe",
                "candidatePosition": "Senior Software Engineer"
            }
        }
    )


class Credit(BaseModel):
    """Category-based credits with items (skills, languages, etc.)."""
    category: Optional[str] = None
    items: Optional[List[str]] = Field(default_factory=list)
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "category": "Languages",
                "items": ["Python", "Java", "JavaScript"]
            }
        }
    )


class ProjectDetail(BaseModel):
    """Key-value pair for project metadata."""
    key: Optional[str] = None
    value: Optional[str] = None
    
    @field_validator('value', mode='before')
    @classmethod
    def convert_list_to_string(cls, v):
        if isinstance(v, list):
            return ", ".join(str(item) for item in v)
        return v
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "key": "Technologies Used",
                "value": "Python, FastAPI, PostgreSQL"
            }
        }
    )


class ProjectExperience(BaseModel):
    """Project with details, descriptions, and responsibilities."""
    projectDetails: Optional[List[ProjectDetail]] = Field(default_factory=list, alias="details")
    description: Optional[str] = None
    responsibilities: Optional[List[str]] = Field(default_factory=list)
    
    @field_validator('projectDetails', mode='before')
    @classmethod
    def convert_strings_to_details(cls, v):
        if not isinstance(v, list):
            return v
        
        processed = []
        for item in v:
            if isinstance(item, str):
                processed.append({"key": "Detail", "value": item})
            else:
                processed.append(item)
        return processed
    
    model_config = ConfigDict(
        populate_by_name=True,
        json_schema_extra={
            "example": {
                "projectDetails": [{"key": "Role", "value": "Lead Developer"}],
                "description": "AI-powered resume parsing system",
                "responsibilities": ["Designed architecture", "Implemented APIs"]
            }
        }
    )


class WorkExperience(BaseModel):
    """Work experience with role, company, dates, location, and descriptions."""
    role: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    from_date: Optional[str] = Field(None, alias="start_date")
    to_date: Optional[str] = Field(None, alias="end_date")
    description: Optional[List[str]] = Field(default_factory=list)
    
    model_config = ConfigDict(
        populate_by_name=True,
        json_schema_extra={
            "example": {
                "role": "Software Engineer",
                "company": "Tech Corp",
                "location": "San Francisco, CA",
                "from_date": "2022-01-01",
                "to_date": "2023-12-31",
                "description": ["Built REST APIs", "Managed database"]
            }
        }
    )


class Education(BaseModel):
    """Education history with degree, institution, dates, courses, and grades."""
    degree: Optional[str] = Field(None, alias="qualification")
    university: Optional[str] = Field(None, alias="institution")
    from_date: Optional[str] = Field(None, alias="start_date")
    to_date: Optional[str] = Field(None, alias="end_date")
    courses: Optional[List[str]] = Field(default_factory=list)
    percentage: Optional[str] = Field(None, alias="grades")
    
    model_config = ConfigDict(
        populate_by_name=True,
        json_schema_extra={
            "example": {
                "degree": "Bachelor of Science",
                "university": "State University",
                "from_date": "2018-09-01",
                "to_date": "2022-05-31",
                "courses": ["Data Structures", "Algorithms"],
                "percentage": "3.8 GPA"
            }
        }
    )


class Certification(BaseModel):
    """Certification with name and issuing organization."""
    name: Optional[str] = None
    by: Optional[str] = Field(None, alias="organization")
    
    model_config = ConfigDict(
        populate_by_name=True,
        json_schema_extra={
            "example": {
                "name": "AWS Solutions Architect",
                "by": "Amazon Web Services"
            }
        }
    )


class ResumeData(BaseModel):
    """Root object containing all resume information."""
    headers: Optional["Headers"] = Field(None, alias="Headers")
    professionalSummary: Optional[str] = Field(None, alias="professional_summary")
    professionalExperience: Optional[List[str]] = Field(default_factory=list, alias="work_experience")
    education: Optional[List[str]] = Field(default_factory=list)
    certifications: Optional[List[str]] = Field(default_factory=list)
    projectExperience: Optional[List["ProjectExperience"]] = Field(default_factory=list, alias="projects")
    credits: Optional[List[Credit]] = Field(default_factory=list)
    awards: Optional[List[str]] = Field(default_factory=list)
    miscellaneous: Optional[List[str]] = Field(default_factory=list)
    
    model_config = ConfigDict(
        populate_by_name=True,
        json_schema_extra={
            "example": {
                "Headers": {
                    "candidateName": "Jane Smith",
                    "candidatePosition": "Data Scientist"
                },
                "professionalSummary": "Experienced data scientist with 5+ years in ML",
                "professionalExperience": [],
                "education": [],
                "certifications": [],
                "projectExperience": [],
                "credits": [],
                "awards": ["Employee of the Year 2023"],
                "miscellaneous": []
            }
        }
    )
