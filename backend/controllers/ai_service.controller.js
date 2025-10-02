import axios from "axios";
import dotenv from "dotenv";
import cloudinary from "../config/cloudinary.js";

dotenv.config();

const AI_SERVICE_URL = process.env.AI_SERVICE_URL;

const deleteTempImages = async () => {
  try {
      const result = await cloudinary.api.delete_resources_by_prefix("temp_uploads/");
      console.log("Deleted temp images:", result);
  } catch (error) {
      console.error("Error deleting temp images:", error.message);
  }
};

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

        // const captionsArray = captions.trim().split(/\n\n/).filter(Boolean).map(caption => caption.trim());
        const captionsArray = captions.split('\n').filter(line => line.trim() !== '').map(line => line.trim());
        const cleanedCaptions = captionsArray.map(caption => caption.replace(/^\d+\.\s*/, ''));

        await deleteTempImages();
  
      res.status(200).json({ message: "Captions generated successfully" , captions: cleanedCaptions });
    } catch (error) {
      console.error("Error generating caption:", error.message);
      console.error(error.toJSON ? error.toJSON() : error);
      res.status(500).json({ message: "Error generating caption" });
    }
  };
