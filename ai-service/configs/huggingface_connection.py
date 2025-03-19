import os
from dotenv import load_dotenv
from huggingface_hub import login

load_dotenv()

def connectHuggingFace():
    try:
        HUGGINGFACE_TOKEN = os.getenv("HUGGINGFACE_TOKEN")
        if not HUGGINGFACE_TOKEN:
            raise ValueError("HUGGINGFACE_TOKEN is not set in environment variables")
        
        login(token=HUGGINGFACE_TOKEN)
        print("Connected to Hugging Face successfully")
    except Exception as e:
        raise Exception(f"Error connecting to Hugging Face: {str(e)}")