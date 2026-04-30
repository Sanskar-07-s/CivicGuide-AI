export const getGeminiModel = (systemPrompt) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return null;

  return {
    startChat: ({ history }) => ({
      sendMessage: async (text) => {
        const fullKey = apiKey.startsWith('AIza') ? apiKey : 'AIza' + apiKey;
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${fullKey}`;
        
        // Merge system prompt into the first message for maximum compatibility
        const contents = [...history];
        if (contents.length === 0) {
          contents.push({
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\nUser Question: ${text}` }]
          });
        } else {
          // If there is history, ensure the system prompt was in the first message or prepend it
          contents.push({ role: 'user', parts: [{ text }] });
        }

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
  return []; // Grounding not supported in basic REST fetch without extra config
};
