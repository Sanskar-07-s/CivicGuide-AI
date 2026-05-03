export const getGeminiModel = (systemPrompt) => {
  // Use ONLY the latest primary key
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return null;

  const fullKey = apiKey.startsWith('AIza') ? apiKey : 'AIza' + apiKey;

  return {
    startChat: ({ history }) => ({
      sendMessage: async (text) => {
        // Using 2.0-flash-exp as it often has a separate quota pool
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${fullKey}`;
        
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
          if (response.status === 429) {
            throw new Error('I am currently experiencing high traffic. Please wait 1 minute and try again!');
          }
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
