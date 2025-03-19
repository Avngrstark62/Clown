import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// const AI_SERVICE_URL = "http://ai-service:8001";
// const AI_SERVICE_URL = "https://clownapp.fun/ai-service";
const AI_SERVICE_URL = process.env.AI_SERVICE_URL;

export const generateCaption = async (req, res) => {
    try {
        const captionsRequest = req.body;

        if (!captionsRequest.input) {
            return res.status(400).json({ message: "Input not provided" });
        }
        
        if (!captionsRequest.type) {
            return res.status(400).json({ message: "Type not provided" });
        }

        const response = await axios.post(`${AI_SERVICE_URL}/generate-caption`, captionsRequest);
        const captions = response.data.captions;

        const captionsArray = captions.trim().split(/\n\n/).filter(Boolean).map(caption => caption.trim());
        const cleanedCaptions = captionsArray.map(caption => caption.replace(/^\d+\.\s*/, ''));
  
      res.status(200).json({ message: "Captions generated successfully" , captions: cleanedCaptions });
    } catch (error) {
      console.error("Error generating caption:", error.message);
      res.status(500).json({ message: "Error generating caption" });
    }
  };