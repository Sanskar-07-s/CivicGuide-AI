export const getGeminiModel = (systemPrompt) => {
  const apiKey1 = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;
  const apiKey2 = import.meta.env.VITE_GEMINI_API_KEY_2 || import.meta.env.GEMINI_API_KEY_2;
  
  if (!apiKey1 && !apiKey2) return null;

  const keys = [apiKey1, apiKey2].filter(Boolean).map(k => k.startsWith('AIza') ? k : 'AIza' + k);
  const models = ["gemini-1.5-flash", "gemini-2.0-flash"];

  return {
    startChat: ({ history }) => ({
      sendMessage: async (text) => {
        let lastError = null;
        
        // Loop through models first (1.5-flash is more stable, 2.0 is smarter)
        for (const model of models) {
          // Then loop through keys
          for (const key of keys) {
            try {
              // Try v1 for 1.5-flash, v1beta for 2.0-flash
              const apiVersion = model.includes('2.0') ? 'v1beta' : 'v1';
              const url = `https://generativelanguage.googleapis.com/${apiVersion}/models/${model}:generateContent?key=${key}`;
              
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
                  generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
                })
              });

              if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 429) {
                  lastError = new Error('RATE_LIMIT');
                  continue; // Try next key
                }
                if (response.status === 404) {
                  lastError = new Error('MODEL_NOT_FOUND');
                  break; // Try next model
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
              if (e.message === 'MODEL_NOT_FOUND') break;
              throw e;
            }
          }
        }
        
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
