import { useState, useEffect, useCallback } from 'react';

export const useVoiceInput = (language = 'en-IN') => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState(null);
  const [supported, setSupported] = useState(true);

  let recognition = null;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setSupported(false);
        return;
      }
      
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
    }
  }, []);

  const startListening = useCallback(() => {
    if (!supported) {
      setError("Microphone not available");
      return;
    }
    
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.lang = language === "Hindi" ? "hi-IN" : "en-IN";
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
        setTranscript('');
        setInterimTranscript('');
      };

      recognition.onresult = (event) => {
        let currentInterim = '';
        let currentFinal = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            currentFinal += event.results[i][0].transcript;
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }

        if (currentFinal) setTranscript(currentFinal);
        setInterimTranscript(currentInterim);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setError("Microphone error");
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setError("Could not start microphone");
      setIsListening(false);
    }
  }, [language, supported]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    error,
    supported,
    startListening,
    stopListening
  };
};
