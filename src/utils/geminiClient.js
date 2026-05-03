export const getGeminiModel = (systemPrompt) => {
  const apiKey1 = import.meta.env.VITE_GEMINI_API_KEY;
  const apiKey2 = import.meta.env.VITE_GEMINI_API_KEY_2;
  
  if (!apiKey1 && !apiKey2) return null;

  const keys = [apiKey1, apiKey2].filter(Boolean).map(k => k.startsWith('AIza') ? k : 'AIza' + k);

  return {
    startChat: ({ history }) => ({
      sendMessage: async (text) => {
        let lastError = null;
        
        // Try each key until one works
        for (const key of keys) {
          try {
            const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${key}`;
            
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
              // If it's a rate limit error (429), try the next key
              if (response.status === 429) {
                lastError = new Error('RATE_LIMIT');
                continue;
              }
              throw new Error(errorData.error?.message || 'API_ERROR');
            }

            const data = await response.json();
            return {
              response: {
                text: () => data.candidates[0].content.parts[0].text,
              }
            };
          } catch (e) {
            lastError = e;
            if (e.message === 'RATE_LIMIT') continue;
            throw e;
          }
        }
        
        // If all keys fail
        if (lastError?.message === 'RATE_LIMIT') {
          throw new Error('I am currently experiencing high traffic and have reached my rate limit. Please wait a moment and try again!');
        }
        throw lastError;
      }
    })
  };
};

export const extractGroundingSources = (response) => {
  return [];
};
