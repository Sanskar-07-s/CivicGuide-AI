import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Loader2, Mic, MapPin, Share2 } from 'lucide-react';
import { getGeminiModel, extractGroundingSources } from '../utils/geminiClient';
import { buildSystemPrompt } from '../utils/systemPrompt';
import { useVoiceInput } from '../hooks/useVoiceInput';
import { useQuizStats } from '../hooks/useQuizStats';
import { ProgressTracker } from './ProgressTracker';
import { ShareCard } from './ShareCard';
import { INDIAN_STATES } from '../constants/states';
import { TOPICS } from '../constants/topics';

const ChatAssistant = ({ initialProfile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi there! I am CivicGuide, your personal election assistant. Ask me anything about voting, deadlines, or the election process!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const [country, setCountry] = useState(initialProfile?.country || "India");
  const [mode, setMode] = useState("chat");
  const [lang, setLang] = useState(initialProfile?.lang || "English");
  const [userState, setUserState] = useState(initialProfile?.userState || "");
  const [userType, setUserType] = useState(initialProfile?.userType || "");

  const [showShareModal, setShowShareModal] = useState(false);

  const { isListening, transcript, interimTranscript, error: micError, supported: micSupported, startListening, stopListening } = useVoiceInput(lang);
  const { stats, updateStats, newBadge } = useQuizStats();

  useEffect(() => {
    if (transcript) {
      setInput(prev => {
        const text = prev + (prev.endsWith(' ') || prev.length === 0 ? '' : ' ') + transcript;
        return text;
      });
    }
  }, [transcript]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, interimTranscript]);

  const handleSend = async (textToSend = input) => {
    if (!textToSend.trim() || isLoading) return;
    
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: textToSend }]);
    setIsLoading(true);

    try {
      const systemPrompt = buildSystemPrompt(country, mode, lang, userState, userType);
      const model = getGeminiModel(systemPrompt);
      
      if (!model) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: "I'm running in demo mode (API key missing). Please add VITE_GEMINI_API_KEY to your environment!" 
        }]);
        setIsLoading(false);
        return;
      }

      const historyMessages = messages
        .filter(m => m.role !== 'assistant' || (!m.content.includes('demo mode') && !m.content.includes('Sorry, I encountered an error')))
        .map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        }));

      if (historyMessages.length > 0 && historyMessages[0].role !== 'user') {
        historyMessages.shift();
      }

      const chat = model.startChat({ history: historyMessages });
      const result = await chat.sendMessage(textToSend);
      const responseText = result.response.text();
      const sources = extractGroundingSources(result.response);
      
      setMessages(prev => [...prev, { role: 'assistant', content: responseText, sources }]);

      if (mode === 'chat' && messages.filter(m => m.role === 'user').length === 0) {
        updateStats(false, country);
      }
      
    } catch (error) {
      console.error("Chat Error:", error);
      let errorMessage = '⚠️ Something went wrong. Please try again.';
      
      if (error.message?.includes('429') || error.status === 429 || error.message?.includes('quota')) {
        errorMessage = "⏳ You've hit the rate limit. Please wait 60 seconds and try again. This is normal on the free tier!";
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuizAnswer = (isCorrect) => {
    updateStats(isCorrect, country);
    if ((stats.totalQuestionsAnswered + 1) % 5 === 0) {
      setShowShareModal(true);
    }
  };

  const formatText = (text, sources) => {
    if (mode === 'quiz' && text.trim().startsWith('{')) {
      try {
        const quizData = JSON.parse(text);
        return (
          <div className="quiz-container">
            <p className="chat-paragraph"><strong>{quizData.question}</strong></p>
            <div className="quiz-options">
              {quizData.options.map((opt, idx) => (
                <button 
                  key={idx} 
                  className="quiz-option" 
                  style={{ textAlign: 'left', width: '100%', cursor: 'pointer' }}
                  onClick={() => {
                    const isCorrect = opt.startsWith(quizData.answer);
                    handleQuizAnswer(isCorrect);
                    alert(isCorrect ? "Correct! 🎉" : "Incorrect. Check the answer below.");
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
            <details className="quiz-answer">
              <summary>Show Answer</summary>
              <p><strong>Correct Answer: {quizData.answer}</strong></p>
              <p>{quizData.explanation}</p>
            </details>
          </div>
        );
      } catch(e) { }
    }

    const elements = text.split('\n').map((line, i) => {
      if (line.includes('💡 *You might also want to know:')) {
        const match = line.match(/"([^"]+)"/);
        const question = match ? match[1] : line.replace('💡 *You might also want to know:', '').replace(/\*/g, '').trim();
        return (
          <div key={i} className="follow-up-suggestion" onClick={() => handleSend(question)}>
            <span className="bulb">💡</span> You might also want to know: 
            <span className="question-text">"{question}"</span>
          </div>
        );
      }
      
      const parts = line.split(/(\*\*.*?\*\*)/g).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });
      return <p key={i} className="chat-paragraph">{parts}</p>;
    });

    if (sources && sources.length > 0) {
      elements.push(
        <div key="sources" className="grounding-sources">
          <div style={{ width: '100%', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div className="live-dot"></div> Live Sources
          </div>
          {sources.slice(0, 3).map((src, i) => (
            <a key={i} href={src.uri} target="_blank" rel="noopener noreferrer" className="source-pill">
              🔗 {new URL(src.uri).hostname.replace('www.', '')}
            </a>
          ))}
        </div>
      );
    }

    return elements;
  };

  return (
    <>
      <AnimatePresence>
        {newBadge && (
          <motion.div 
            className="badge-toast"
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
          >
            <div className="badge-toast-icon">
              {newBadge.name.split(' ')[1]}
            </div>
            <div className="badge-toast-content">
              <h4>Badge Unlocked!</h4>
              <p>{newBadge.name}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showShareModal && <ShareCard stats={stats} onClose={() => setShowShareModal(false)} />}

      <motion.button
        className="chat-fab"
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageSquare size={24} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chat-window"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="chat-header" style={{ flexDirection: 'column', gap: '0.5rem' }}>
              <div className="chat-header-top">
                <div className="chat-title">
                  <Bot size={20} className="brand-icon" />
                  <h3>CivicGuide AI</h3>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="close-btn" onClick={() => setShowShareModal(true)} title="Share">
                    <Share2 size={18} />
                  </button>
                  <button className="close-btn" onClick={() => setIsOpen(false)}>
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="chat-controls" style={{ flexWrap: 'wrap' }}>
                <select value={country} onChange={(e) => setCountry(e.target.value)} className="chat-select">
                  <option value="India">India</option>
                  <option value="USA">USA</option>
                </select>
                <select value={mode} onChange={(e) => setMode(e.target.value)} className="chat-select">
                  <option value="chat">Chat</option>
                  <option value="quiz">Quiz</option>
                  <option value="glossary">Glossary</option>
                </select>
                <select value={lang} onChange={(e) => setLang(e.target.value)} className="chat-select">
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                </select>
                {country === "India" && (
                  <select 
                    value={userState} 
                    onChange={(e) => setUserState(e.target.value)} 
                    className="chat-select"
                    style={{ flexGrow: 1 }}
                  >
                    <option value="">Select State...</option>
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                )}
              </div>
            </div>

            {mode === 'quiz' && <ProgressTracker stats={stats} />}

            <div className="chat-messages">
              {messages.length === 1 && (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  {TOPICS[country][mode].map((topic, i) => (
                    <button 
                      key={i} 
                      className="source-pill" 
                      style={{ cursor: 'pointer', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                      onClick={() => handleSend(topic)}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`message-bubble ${msg.role}`}
                >
                  <div className="message-avatar">
                    {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                  </div>
                  <div className="message-content" style={{ display: 'flex', flexDirection: 'column' }}>
                    {formatText(msg.content, msg.sources)}
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <div className="message-bubble assistant">
                  <div className="message-avatar"><Bot size={16} /></div>
                  <div className="message-content loading">
                    <Loader2 size={16} className="animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
              <textarea
                value={input + (interimTranscript ? ' ' + interimTranscript : '')}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about elections, voting, etc..."
                rows={1}
                className="chat-input"
              />
              {micSupported && (
                <button 
                  className={`mic-btn ${isListening ? 'listening' : ''}`}
                  onClick={isListening ? stopListening : startListening}
                  title={micError || (isListening ? "Listening..." : "Speak")}
                >
                  <Mic size={18} />
                </button>
              )}
              <button 
                className="send-btn"
                onClick={() => handleSend()}
                disabled={(!input.trim() && !interimTranscript) || isLoading}
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatAssistant;
