from huggingface_hub import InferenceClient

class CaptionGenerator:
    """A class to generate social media captions from images or text descriptions."""

    def __init__(self):
        self.client = InferenceClient()
        self.image_caption_model = "Salesforce/blip-image-captioning-base"
        self.caption_generator_model = "mistralai/Mistral-7B-Instruct-v0.3"

    def generate_from_image(self, image_url: str) -> str:
        """Generate captions based on an image URL."""
        image_description = self.client.image_to_text(image_url, model=self.image_caption_model)
        return self._generate_caption_from_text(image_description)

    def generate_from_text(self, description: str) -> str:
        """Generate captions based on a text description."""
        return self._generate_caption_from_text(description)

    def _generate_caption_from_text(self, description: str) -> str:
        """Helper function to generate captions using text description."""
        prompt = f"Generate 5 creative social media captions for this image: {description}. Make it engaging, fun, and shareable."
        caption = self.client.text_generation(prompt, model=self.caption_generator_model)
        return caption

    def generate_caption(self, request: dict) -> str:
        """Handles JSON input and selects the appropriate generation method."""
        caption_type = request.get("type")
        user_input = request.get("input")

        if not caption_type or not user_input:
            raise ValueError("Request must contain 'type' and 'input' fields.")

        if caption_type == "image":
            return self.generate_from_image(user_input)
        elif caption_type == "text":
            return self.generate_from_text(user_input)
        else:
            raise ValueError("Invalid type. Must be 'image' or 'text'.")