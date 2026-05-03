import { GoogleGenerativeAI } from "@google/generative-ai";

// geminiClient.js — clean and secure
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("Missing VITE_GEMINI_API_KEY");
}

const genAI = new GoogleGenerativeAI(API_KEY);

export const getGeminiModel = (systemPrompt) => {
  if (!API_KEY) return null;
  
  return genAI.getGenerativeModel({
    model: "gemini-2.0-flash", // Use the most stable one verified for your key
    systemInstruction: systemPrompt,
  });
};

export const extractGroundingSources = (response) => {
  try {
    return response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map(chunk => chunk.web)
      ?.filter(Boolean) ?? [];
  } catch (e) {
    return [];
  }
};
