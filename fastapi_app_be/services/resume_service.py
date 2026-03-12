"""
Resume service for parsing and processing resume data.
Main business logic for resume extraction and skill matching.
"""
import json
from fastapi import UploadFile
from models.resume import ResumeData
from models.requests import SkillResponse
from services import file_service, gemini_service
from utils import file_utils, constants
from exceptions.custom_exceptions import FileProcessingException, GeminiAPIException


def _convert_gemini_response_to_api_format(json_response: dict) -> dict:
    """
    Convert Gemini's response (with Education/Certification objects) to API format (strings).
    
    Args:
        json_response: Raw JSON response from Gemini with nested objects
        
    Returns:
        Converted dict with education/certifications/work_experience as strings
    """
    # Convert education objects to strings
    if json_response.get("education") and isinstance(json_response["education"], list):
        formatted_education = []
        for edu in json_response["education"]:
            if isinstance(edu, dict):
                parts = []
                if edu.get("degree"):
                    parts.append(edu["degree"])
                if edu.get("institution") or edu.get("university"):
                    inst = edu.get("institution") or edu.get("university")
                    parts.append(f"from {inst}")
                if edu.get("start_date") or edu.get("from_date") or edu.get("end_date") or edu.get("to_date"):
                    start = edu.get("start_date") or edu.get("from_date")
                    end = edu.get("end_date") or edu.get("to_date")
                    date_str = ""
                    if start:
                        date_str = start[:4] if len(start) >= 4 else start
                    if end:
                        end_year = end[:4] if len(end) >= 4 else end
                        if date_str:
                            date_str = f"{date_str}-{end_year}"
                        else:
                            date_str = end_year
                    if date_str:
                        parts.append(f"({date_str})")
                if parts:
                    formatted_education.append(" ".join(parts))
            else:
                formatted_education.append(str(edu))
        json_response["education"] = formatted_education
    
    # Convert certification objects to strings
    if json_response.get("certifications") and isinstance(json_response["certifications"], list):
        formatted_certs = []
        for cert in json_response["certifications"]:
            if isinstance(cert, dict):
                parts = []
                if cert.get("name"):
                    parts.append(cert["name"])
                if cert.get("organization") or cert.get("by"):
                    org = cert.get("by") or cert.get("organization")
                    parts.append(f"- {org}")
                if parts:
                    formatted_certs.append(" ".join(parts))
            else:
                formatted_certs.append(str(cert))
        json_response["certifications"] = formatted_certs
    
    # Convert work experience objects to strings  
    if json_response.get("work_experience") and isinstance(json_response["work_experience"], list):
        formatted_exp = []
        for exp in json_response["work_experience"]:
            if isinstance(exp, dict):
                parts = []
                if exp.get("role"):
                    parts.append(exp["role"])
                if exp.get("company"):
                    parts.append(f"at {exp['company']}")
                if exp.get("location"):
                    parts.append(f"in {exp['location']}")
                # Add date range
                if exp.get("start_date") or exp.get("from_date") or exp.get("end_date") or exp.get("to_date"):
                    start = exp.get("start_date") or exp.get("from_date")
                    end = exp.get("end_date") or exp.get("to_date")
                    date_str = ""
                    if start:
                        date_str = start[:4] if len(start) >= 4 else start
                    if end:
                        end_year = end[:4] if len(end) >= 4 else end
                        if date_str:
                            date_str = f"({date_str}-{end_year})"
                        else:
                            date_str = f"({end_year})"
                    if date_str:
                        parts.append(date_str)
                if parts:
                    formatted_exp.append(" ".join(parts))
                # Add descriptions/responsibilities if available
                if exp.get("description"):
                    if isinstance(exp["description"], list):
                        formatted_exp.extend(exp["description"])
                    else:
                        formatted_exp.append(exp["description"])
                if exp.get("responsibilities"):
                    if isinstance(exp["responsibilities"], list):
                        formatted_exp.extend(exp["responsibilities"])
                    else:
                        formatted_exp.append(exp["responsibilities"])
            else:
                formatted_exp.append(str(exp))
        json_response["work_experience"] = formatted_exp
    
    return json_response


def _format_resume_for_api(resume_data: ResumeData) -> dict:
    """
    Transform ResumeData to format for API response with proper string conversions.
    
    Converts:
    - Education objects to formatted strings
    - Certification objects to formatted strings  
    - WorkExperience objects to formatted strings
    
    Args:
        resume_data: ResumeData object with parsed data
        
    Returns:
        Dictionary formatted for API response
    """
    data = resume_data.model_dump(by_alias=True, exclude_none=True)
    
    # Convert education objects to strings
    if data.get("education") and isinstance(data["education"], list) and len(data["education"]) > 0:
        if isinstance(data["education"][0], dict):
            formatted_education = []
            for edu in data["education"]:
                parts = []
                if edu.get("degree"):
                    parts.append(edu["degree"])
                if edu.get("university"):
                    parts.append(f"from {edu['university']}")
                if edu.get("from_date") or edu.get("to_date"):
                    date_str = ""
                    if edu.get("from_date"):
                        date_str = edu["from_date"][:4] if len(edu["from_date"]) >= 4 else edu["from_date"]
                    if edu.get("to_date"):
                        end_year = edu["to_date"][:4] if len(edu["to_date"]) >= 4 else edu["to_date"]
                        if date_str:
                            date_str = f"{date_str}-{end_year}"
                        else:
                            date_str = end_year
                    if date_str:
                        parts.append(f"({date_str})")
                if parts:
                    formatted_education.append(" ".join(parts))
            data["education"] = formatted_education
    
    # Convert certification objects to strings
    if data.get("certifications") and isinstance(data["certifications"], list) and len(data["certifications"]) > 0:
        if isinstance(data["certifications"][0], dict):
            formatted_certs = []
            for cert in data["certifications"]:
                parts = []
                if cert.get("name"):
                    parts.append(cert["name"])
                if cert.get("by"):
                    parts.append(f"- {cert['by']}")
                if parts:
                    formatted_certs.append(" ".join(parts))
            data["certifications"] = formatted_certs
    
    # Convert work_experience to professionalExperience as strings
    if data.get("professionalExperience"):
        if isinstance(data["professionalExperience"], list) and len(data["professionalExperience"]) > 0:
            if isinstance(data["professionalExperience"][0], dict):
                formatted_exp = []
                for exp in data["professionalExperience"]:
                    parts = []
                    if exp.get("role"):
                        parts.append(exp["role"])
                    if exp.get("company"):
                        parts.append(f"at {exp['company']}")
                    # Add descriptions if available
                    if exp.get("description") and isinstance(exp["description"], list):
                        formatted_exp.extend(exp["description"])
                    else:
                        if parts:
                            formatted_exp.append(" ".join(parts))
                        else:
                            if exp.get("description"):
                                formatted_exp.append(exp["description"])
                if formatted_exp:
                    data["professionalExperience"] = formatted_exp
    
    return data


async def extract_resume_data(file: UploadFile) -> ResumeData:
    """
    Extract structured resume data from uploaded file.
    
    Process:
    1. Save uploaded file to temp location
    2. Extract text from file (PDF/DOCX/PPTX)
    3. Send to Gemini API with structured prompt
    4. Parse JSON response into ResumeData model
    5. Clean up temp file
    
    Args:
        file: Uploaded file (PDF/DOCX/PPTX)
        
    Returns:
        Parsed ResumeData object
        
    Raises:
        FileProcessingException: If file processing fails
        GeminiAPIException: If Gemini API call fails
    """
    file_path = None
    try:
        # Save uploaded file
        file_path = await file_utils.save_upload_file(file)
        
        # Extract text from file
        text_content = await file_service.extract_text_from_file(file_path)
        
        if not text_content or not text_content.strip():
            raise FileProcessingException("No text content extracted from file")
        
        # Create prompt for Gemini
        prompt = constants.RESUME_PROMPT.replace("{resume_text}", text_content)
        
        # Call Gemini API and parse response
        json_response = await gemini_service.call_gemini_and_parse_json(prompt)
        
        # Convert objects to strings for API format
        json_response = _convert_gemini_response_to_api_format(json_response)
        
        # Convert to ResumeData model
        resume_data = ResumeData(**json_response)
        
        return resume_data
        
    except (FileProcessingException, GeminiAPIException):
        raise
    except Exception as e:
        raise FileProcessingException(f"Error extracting resume data: {str(e)}")
    finally:
        # Clean up temp file
        if file_path:
            await file_utils.cleanup_temp_file(file_path)


async def extract_raw_with_formatter_prompt(file: UploadFile) -> ResumeData:
    """
    Extract resume data using alternative formatter prompt.
    Provides different parsing approach than standard resume extraction.
    
    Args:
        file: Uploaded file (PDF/DOCX/PPTX)
        
    Returns:
        Parsed ResumeData object
        
    Raises:
        FileProcessingException: If file processing fails
        GeminiAPIException: If Gemini API call fails
    """
    file_path = None
    try:
        # Save uploaded file
        file_path = await file_utils.save_upload_file(file)
        
        # Extract text from file
        text_content = await file_service.extract_text_from_file(file_path)
        
        if not text_content or not text_content.strip():
            raise FileProcessingException("No text content extracted from file")
        
        # Create prompt with formatter template
        prompt = constants.RAW_FORMATTER_PROMPT.replace("{resume_text}", text_content)
        
        # Call Gemini API and parse response
        json_response = await gemini_service.call_gemini_and_parse_json(prompt)
        
        # Convert objects to strings for API format
        json_response = _convert_gemini_response_to_api_format(json_response)
        
        # Convert to ResumeData model
        resume_data = ResumeData(**json_response)
        
        return resume_data
        
    except (FileProcessingException, GeminiAPIException):
        raise
    except Exception as e:
        raise FileProcessingException(f"Error extracting raw resume data: {str(e)}")
    finally:
        # Clean up temp file
        if file_path:
            await file_utils.cleanup_temp_file(file_path)


async def extract_skills(resume_data: ResumeData, job_description: str) -> SkillResponse:
    """
    Extract and match skills from resume against job description.
    
    Process:
    1. Convert ResumeData to JSON
    2. Create prompt with resume JSON and job description
    3. Call Gemini API to extract and match skills
    4. Parse response into SkillResponse with resume_skills, required_skills, matched_skills
    
    Args:
        resume_data: Parsed resume data model
        job_description: Job description text to match against
        
    Returns:
        SkillResponse with matched, required, and resume skills
        
    Raises:
        GeminiAPIException: If API call fails
    """
    try:
        if not job_description or not job_description.strip():
            raise ValueError("Job description cannot be empty")
        
        # Convert resume to JSON string
        resume_json = resume_data.model_dump_json(exclude_none=True)
        
        # Create skill extraction prompt
        prompt = constants.SKILL_PROMPT.replace("{resume_json}", resume_json).replace("{job_description}", job_description)
        
        # Call Gemini API
        json_response = await gemini_service.call_gemini_and_parse_json(prompt)
        
        # Parse response
        skill_response = SkillResponse(
            resume_skills=_sort_and_deduplicate(json_response.get("resume_skills", [])),
            required_skills=_sort_and_deduplicate(json_response.get("required_skills", [])),
            matched_skills=_sort_and_deduplicate(json_response.get("matched_skills", []))
        )
        
        return skill_response
        
    except GeminiAPIException:
        raise
    except Exception as e:
        raise GeminiAPIException(f"Error extracting skills: {str(e)}")


def _sort_and_deduplicate(items: list) -> list:
    """
    Sort and remove duplicates from a list.
    
    Args:
        items: List to process
        
    Returns:
        Sorted list with duplicates removed
    """
    if not items:
        return []
    return sorted(list(set(str(item).lower().strip() for item in items)))
