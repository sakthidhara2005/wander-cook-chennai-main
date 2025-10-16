import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

// Your API key
const API_KEY = process.env.VITE_GEMINI_API_KEY || "YOUR_GEMINI_API_KEY";
const genAI = new GoogleGenerativeAI(API_KEY);

// Read image as Base64
const imagePath = "D:/wander-cook-chennai-main/image.png";
const imageData = fs.readFileSync(imagePath, { encoding: "base64" });

async function analyzeImage() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-vision" });
    const result = await model.generateContent([
      {
        inputType: "image",
        inlineData: { data: imageData, mimeType: "image/png" },
        prompt: "Describe this image in detail"
      }
    ]);
    console.log("✅ Image Analysis Result:");
    console.log(result.response.text());
  } catch (error) {
    console.error("❌ Error analyzing image:", error);
  }
}

analyzeImage();
