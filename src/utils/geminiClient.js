export const getGeminiModel = (systemPrompt) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return null;

  return {
    startChat: ({ history }) => ({
      sendMessage: async (text) => {
        const fullKey = apiKey.startsWith('AIza') ? apiKey : 'AIza' + apiKey;
        // Using v1beta and 2.0-flash as it's the only one that didn't 404 today
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${fullKey}`;
        
        const contents = [...history.map(h => ({
          role: h.role === 'model' ? 'model' : 'user',
          parts: h.parts
        }))];
        
        contents.push({ role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: ${text}` }] });

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: contents,
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
          }
        };
      }
    })
  };
};

export const extractGroundingSources = (response) => {
  return [];
};
