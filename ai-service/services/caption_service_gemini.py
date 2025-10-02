from google import genai
from google.genai import types
import base64
import requests
from io import BytesIO
import os
from dotenv import load_dotenv

load_dotenv()

class CaptionGenerator:
    """A class to generate social media captions from images or text descriptions using Google Gemini API."""

    def __init__(self):
        print("[CaptionGenerator] Initializing...")
        # Initialize Gemini client
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            print("[CaptionGenerator] ERROR: GOOGLE_API_KEY not found in environment")
            raise ValueError("GOOGLE_API_KEY is not set in the environment")
        print("[CaptionGenerator] API key loaded successfully")
        self.client = genai.Client(api_key=api_key)

        # Use gemini-2.5-flash for both text and multimodal (image) inputs
        self.model = "gemini-2.5-flash"
        print(f"[CaptionGenerator] Using model: {self.model}")
        print("[CaptionGenerator] Initialization complete")

    def generate_from_text(self, description: str) -> str:
        """Generate captions based on a text description."""
        print(f"[generate_from_text] Generating captions for text: '{description[:50]}...'")
        prompt = f"Generate 5 creative social media captions for this text: {description}. Make it engaging, fun, and shareable."
        
        print("[generate_from_text] Sending request to Gemini API...")
        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt
        )
        print("[generate_from_text] Response received successfully")
        return response.text

    def generate_from_image(self, image_url: str) -> str:
        """Generate captions based on an image URL."""
        print(f"[generate_from_image] Processing image from URL: {image_url}")
        
        # Download image
        print("[generate_from_image] Downloading image...")
        resp = requests.get(image_url)
        if resp.status_code != 200:
            print(f"[generate_from_image] ERROR: Failed to fetch image, status code: {resp.status_code}")
            raise ValueError(f"Failed to fetch image: {resp.status_code}")
        image_bytes = resp.content
        print(f"[generate_from_image] Image downloaded successfully, size: {len(image_bytes)} bytes")

        prompt = "Generate 5 creative social media captions for this image. Make it engaging, fun, and shareable."
        
        # Create multimodal content with text and image
        print("[generate_from_image] Sending image to Gemini API...")
        response = self.client.models.generate_content(
            model=self.model,
            contents=[
                prompt,
                types.Part.from_bytes(
                    data=image_bytes,
                    mime_type="image/jpeg"  # Adjust based on actual image type
                )
            ]
        )
        print("[generate_from_image] Response received successfully")
        return response.text

    def generate_caption(self, request: dict) -> str:
        """Handles JSON input and selects the appropriate generation method."""
        print(f"[generate_caption] Received request: type={request.get('type')}")
        caption_type = request.get("type")
        user_input = request.get("input")

        if not caption_type or not user_input:
            print("[generate_caption] ERROR: Missing 'type' or 'input' in request")
            raise ValueError("Request must contain 'type' and 'input' fields.")

        if caption_type == "image":
            print("[generate_caption] Routing to generate_from_image")
            return self.generate_from_image(user_input)
        elif caption_type == "text":
            print("[generate_caption] Routing to generate_from_text")
            return self.generate_from_text(user_input)
        else:
            print(f"[generate_caption] ERROR: Invalid type '{caption_type}'")
            raise ValueError("Invalid type. Must be 'image' or 'text'.")
