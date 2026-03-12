"""
Gemini API service for calling Google's Generative AI API.
Handles API communication and response parsing.
"""
import asyncio
import json
import re
from typing import Optional
import google.generativeai as genai
from config import get_settings
from exceptions.custom_exceptions import GeminiAPIException
from utils.constants import GEMINI_MODEL, GEMINI_TEMPERATURE


# Initialize Gemini API
settings = get_settings()
genai.configure(api_key=settings.gemini_api_key)


async def call_gemini_api(
    prompt: str,
    temperature: Optional[float] = None
) -> str:
    """
    Call Gemini API with given prompt.
    
    Args:
        prompt: The prompt text to send to Gemini
        temperature: Temperature for response generation (0-1, default 0.3)
        
    Returns:
        Response text from Gemini API
        
    Raises:
        GeminiAPIException: If API call fails
    """
    try:
        if temperature is None:
            temperature = GEMINI_TEMPERATURE
        
        # Initialize model
        model = genai.GenerativeModel(
            model_name=GEMINI_MODEL,
            generation_config={
                "temperature": temperature,
                "top_p": 1,
                "top_k": 1,
                "max_output_tokens": 4096
            }
        )
        
        # Run API call in thread pool to avoid blocking
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None,
            lambda: model.generate_content(prompt)
        )
        
        if not response.text:
            raise GeminiAPIException("Empty response from Gemini API")
        
        return response.text
        
    except GeminiAPIException:
        raise
    except Exception as e:
        raise GeminiAPIException(f"Failed to call Gemini API: {str(e)}")


async def extract_json_from_response(response_text: str) -> dict:
    """
    Parse JSON from Gemini API response.
    Handles markdown code blocks and malformed JSON.
    
    Args:
        response_text: Response text from Gemini API
        
    Returns:
        Parsed JSON as dictionary
        
    Raises:
        GeminiAPIException: If JSON parsing fails
    """
    try:
        # Remove markdown code blocks (```json ... ```)
        cleaned_text = response_text
        
        # Remove markdown json code block
        json_match = re.search(r'```(?:json)?\s*([\s\S]*?)\s*```', cleaned_text)
        if json_match:
            cleaned_text = json_match.group(1)
        
        # Also try to match JSON object directly
        json_match = re.search(r'\{[\s\S]*\}', cleaned_text)
        if json_match:
            json_str = json_match.group(0)
        else:
            json_str = cleaned_text.strip()
        
        # Parse JSON
        parsed_json = json.loads(json_str)
        return parsed_json
        
    except json.JSONDecodeError as e:
        raise GeminiAPIException(f"Failed to parse JSON from Gemini response: {str(e)}")
    except Exception as e:
        raise GeminiAPIException(f"Error processing Gemini response: {str(e)}")


async def call_gemini_and_parse_json(
    prompt: str,
    temperature: Optional[float] = None
) -> dict:
    """
    Call Gemini API and parse the response as JSON.
    Convenience function combining endpoint call and JSON parsing.
    
    Args:
        prompt: The prompt to send
        temperature: Temperature setting
        
    Returns:
        Parsed JSON response as dictionary
        
    Raises:
        GeminiAPIException: If API call or parsing fails
    """
    response_text = await call_gemini_api(prompt, temperature)
    parsed_json = await extract_json_from_response(response_text)
    return parsed_json
