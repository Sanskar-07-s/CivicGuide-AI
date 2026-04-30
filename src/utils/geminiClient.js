import { GoogleGenerativeAI } from '@google/generative-ai';

const getKeys = () => {
  const keys = [
    import.meta.env.VITE_GEMINI_API_KEY,
    import.meta.env.VITE_GEMINI_API_KEY_2,
    import.meta.env.VITE_GEMINI_API_KEY_3
  ].filter(Boolean).map(key => key.startsWith('AIza') ? key : 'AIza' + key);
  return keys;
};

export const getGeminiModel = (systemPrompt, keyIndex = 0) => {
  const keys = getKeys();
  if (keys.length === 0) return null;
  
  // Use the requested index, wrapped around to stay within bounds
  const apiKey = keys[keyIndex % keys.length];
  
  const client = new GoogleGenerativeAI(apiKey);
  
  return client.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
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
