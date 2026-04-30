import { GoogleGenerativeAI } from '@google/generative-ai';

export const getGeminiModel = (systemPrompt) => {
  let apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return null;
  
  // Ensure the key has the correct prefix
  // Hard-force the stable v1 endpoint in the constructor
  const genAI = new GoogleGenerativeAI(apiKey, { apiVersion: 'v1' });
  
  return genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
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
