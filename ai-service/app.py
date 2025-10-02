import traceback

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
# from configs.huggingface_connection import connectHuggingFace
# from services.caption_service import CaptionGenerator
from services.caption_service_gemini import CaptionGenerator

# connectHuggingFace()

app = FastAPI()

@app.get("/")
def home():
    return {"message": "AI Service Running!"}

class CaptionRequest(BaseModel):
    type: str
    input: str

@app.post("/generate-caption")
def generate_caption(request: CaptionRequest):
    try:
        caption_generator = CaptionGenerator()
        captions = caption_generator.generate_caption(request.model_dump())
        return {"captions": captions}
    except Exception as e:
        print("⚠️ Error in /generate-caption:")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal error while generating caption.")
        # raise HTTPException(status_code=500, detail=str(e))
    
# uvicorn app:app --host 0.0.0.0 --port 5000
# taskkill /IM python.exe /F
