import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI = null;

export const getGeminiModel = (systemPrompt) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return null;
  
  if (!genAI) {
    genAI = new GoogleGenerativeAI(apiKey);
  }
  
  return genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: systemPrompt,
    tools: [{ googleSearch: {} }],
  });
};

export const extractGroundingSources = (response) => {
  try {
    return response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map(chunk => chunk.web)
      ?.filter(Boolean) ?? [];
  } catch (e) {
    console.error("Error extracting grounding sources", e);
    return [];
  }
};
