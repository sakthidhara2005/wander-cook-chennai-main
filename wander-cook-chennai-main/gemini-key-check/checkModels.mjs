import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyBt_Toget9sg8DD-DJcIvcMcYNHRznMICQ";
const genAI = new GoogleGenerativeAI(API_KEY);

async function testModelAccess() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    const result = await model.generateContent("Hello, Gemini!");
    console.log("✅ Model access successful:", result.response.text());
  } catch (error) {
    console.error("❌ Error accessing model:", error);
    if (error.status === 403) {
      console.log("🚨 Your API key might not have access to this model.");
      console.log("👉 Regenerate a key or upgrade your tier in Google AI Studio.");
    }
  }
}

testModelAccess();
