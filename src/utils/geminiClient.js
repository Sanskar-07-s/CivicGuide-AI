import { GoogleGenerativeAI } from '@google/generative-ai';

export const getGeminiModel = (systemPrompt) => {
  let apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return null;
  
  // Ensure the key has the correct prefix
  if (!apiKey.startsWith('AIza')) {
    apiKey = 'AIza' + apiKey;
  }
  
  const genAI = new GoogleGenerativeAI(apiKey);
  
  return genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
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
