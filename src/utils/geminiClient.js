export const getGeminiModel = (systemPrompt) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return null;

  // Returning a mock "model" object that mimics the SDK but uses direct fetch
  return {
    startChat: ({ history }) => ({
      sendMessage: async (text) => {
        const fullKey = apiKey.startsWith('AIza') ? apiKey : 'AIza' + apiKey;
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${fullKey}`;
        
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: [
              ...history.map(h => ({
                role: h.role,
                parts: h.parts
              })),
              { role: 'user', parts: [{ text }] }
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2048,
            }
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'API_ERROR');
        }

        const data = await response.json();
        return {
          response: {
            text: () => data.candidates[0].content.parts[0].text,
            groundingMetadata: data.candidates[0].groundingMetadata
          }
        };
      }
    })
  };
};

export const extractGroundingSources = (response) => {
  try {
    return response.groundingMetadata?.groundingChunks
      ?.map(chunk => chunk.web)
      ?.filter(Boolean) ?? [];
  } catch (e) {
    return [];
  }
};
