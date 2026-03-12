"""
Utility functions for file handling.
"""
import os
import tempfile
import asyncio
from pathlib import Path
from fastapi import UploadFile
from utils.constants import SUPPORTED_FORMATS, MAX_FILE_SIZE_BYTES
from exceptions.custom_exceptions import FileFormatException, FileSizeException


def get_file_extension(filename: str) -> str:
    """
    Get file extension from filename.
    
    Args:
        filename: The filename to extract extension from
        
    Returns:
        File extension (lowercase, without dot)
    """
    return Path(filename).suffix.lower().lstrip('.')


def validate_file_format(file_extension: str) -> None:
    """
    Validate that file format is supported.
    
    Args:
        file_extension: File extension to validate
        
    Raises:
        FileFormatException: If format is not supported
    """
    if file_extension.lower() not in SUPPORTED_FORMATS:
        raise FileFormatException(file_extension, list(SUPPORTED_FORMATS))


def validate_file_size(file_size: int) -> None:
    """
    Validate that file size is within limits.
    
    Args:
        file_size: Size in bytes
        
    Raises:
        FileSizeException: If file exceeds maximum size
    """
    if file_size > MAX_FILE_SIZE_BYTES:
        raise FileSizeException(file_size, MAX_FILE_SIZE_BYTES)


async def save_upload_file(file: UploadFile) -> str:
    """
    Save uploaded file to temporary directory.
    
    Args:
        file: FastAPI UploadFile
        
    Returns:
        Path to saved file
        
    Raises:
        FileSizeException: If file is too large
        FileFormatException: If format is not supported
    """
    # Get file extension
    file_extension = get_file_extension(file.filename)
    validate_file_format(file_extension)
    
    # Create temporary file
    temp_dir = tempfile.gettempdir()
    temp_filename = f"{Path(file.filename).stem}_{os.urandom(4).hex()}.{file_extension}"
    temp_path = os.path.join(temp_dir, temp_filename)
    
    # Read and save file
    content = await file.read()
    validate_file_size(len(content))
    
    with open(temp_path, 'wb') as f:
        f.write(content)
    
    return temp_path


async def cleanup_temp_file(file_path: str) -> None:
    """
    Delete temporary file.
    
    Args:
        file_path: Path to file to delete
    """
    try:
        if os.path.exists(file_path):
            # Run in thread pool to avoid blocking
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(None, os.remove, file_path)
    except Exception as e:
        print(f"Warning: Failed to delete temporary file {file_path}: {e}")


def generate_filename(name: str, position: str) -> str:
    """
    Generate a formatted filename for download.
    Converts name and position to filename format.
    
    Args:
        name: Candidate name
        position: Position/title
        
    Returns:
        Formatted filename with .docx extension
    """
    # Remove special characters and convert to valid filename
    safe_name = "".join(c for c in name if c.isalnum() or c in (' ', '-', '_')).strip()
    safe_position = "".join(c for c in position if c.isalnum() or c in (' ', '-', '_')).strip()
    
    if safe_name and safe_position:
        filename = f"{safe_name}_{safe_position}"
    elif safe_name:
        filename = safe_name
    elif safe_position:
        filename = safe_position
    else:
        filename = "resume"
    
    # Replace spaces with underscores
    filename = filename.replace(" ", "_")
    
    # Add extension
    return f"{filename}.docx"


def get_supported_formats() -> list:
    """
    Get list of supported file formats.
    
    Returns:
        List of supported format strings
    """
    return list(SUPPORTED_FORMATS)
