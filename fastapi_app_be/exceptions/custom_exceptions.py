"""
Custom exception classes for the Resume Standardizer application.
"""


class ResumeStandardizerException(Exception):
    """Base exception for the Resume Standardizer application."""
    
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class GeminiAPIException(ResumeStandardizerException):
    """Exception raised for Gemini API errors."""
    
    def __init__(self, message: str, status_code: int = 500):
        super().__init__(f"Gemini API Error: {message}", status_code)


class FileProcessingException(ResumeStandardizerException):
    """Exception raised for file processing errors."""
    
    def __init__(self, message: str, status_code: int = 400):
        super().__init__(f"File Processing Error: {message}", status_code)


class ValidationException(ResumeStandardizerException):
    """Exception raised for validation errors."""
    
    def __init__(self, message: str, status_code: int = 422):
        super().__init__(f"Validation Error: {message}", status_code)


class FileFormatException(FileProcessingException):
    """Exception raised for unsupported file formats."""
    
    def __init__(self, file_format: str, supported_formats: list):
        message = f"Unsupported file format '{file_format}'. Supported formats: {', '.join(supported_formats)}"
        super().__init__(message, 400)


class FileSizeException(FileProcessingException):
    """Exception raised when file exceeds size limit."""
    
    def __init__(self, file_size: int, max_size: int):
        message = f"File size ({file_size} bytes) exceeds maximum allowed size ({max_size} bytes)"
        super().__init__(message, 413)
