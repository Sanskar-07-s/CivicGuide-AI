import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { INDIAN_STATES } from '../constants/states';
import { translations } from '../translations';

export const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState(null);
  const [country, setCountry] = useState(null);
  const [userState, setUserState] = useState('');
  const [lang, setLang] = useState('English');

  const t = translations[lang].onboarding;

  const handleComplete = () => {
    localStorage.setItem('civicguide_onboarded', 'true');
    onComplete({ userType, country, userState, lang });
  };

  const nextStep = () => setStep(prev => prev + 1);

  return (
    <div className="modal-overlay">
      <motion.div 
        className="glass-panel"
        style={{ padding: '2rem', width: '90%', maxWidth: '500px', background: 'var(--bg-primary)' }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" className="onboarding-content" exit={{ opacity: 0, x: -20 }}>
              <div className="onboarding-icon">🗳️</div>
              <h2>{t.welcome}</h2>
              <p style={{ color: 'var(--text-secondary)' }}>{t.subWelcome}</p>
              <button className="onboarding-btn" onClick={nextStep}>{t.start}</button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" className="onboarding-content" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2>{translations['English'].onboarding.langPrompt}</h2>
              <div className="selection-grid">
                <button className={`onboarding-btn ${lang === 'English' ? '' : 'secondary'}`} onClick={() => { setLang('English'); nextStep(); }}>English</button>
                <button className={`onboarding-btn ${lang === 'Hindi' ? '' : 'secondary'}`} onClick={() => { setLang('Hindi'); nextStep(); }}>हिंदी</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" className="onboarding-content" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2>{t.firstTime}</h2>
              <div className="selection-grid" style={{ gridTemplateColumns: '1fr' }}>
                <button className="onboarding-btn" onClick={() => { setUserType('first-time'); nextStep(); }}>{t.yesFirst}</button>
                <button className="onboarding-btn secondary" onClick={() => { setUserType('experienced'); nextStep(); }}>{t.noVoted}</button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" className="onboarding-content" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2>{t.country}</h2>
              <div className="selection-grid">
                <div className="selection-card" onClick={() => { setCountry('India'); nextStep(); }}>
                  <div style={{ fontSize: '3rem' }}>🇮🇳</div>
                  <h3>India</h3>
                </div>
                <div className="selection-card" onClick={() => { setCountry('USA'); setStep(6); }}>
                  <div style={{ fontSize: '3rem' }}>🇺🇸</div>
                  <h3>USA</h3>
                </div>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="step5" className="onboarding-content" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2>{t.state}</h2>
              <select 
                className="state-select" 
                value={userState} 
                onChange={(e) => setUserState(e.target.value)}
              >
                <option value="" disabled>{t.selectState}</option>
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button 
                className="onboarding-btn" 
                onClick={nextStep}
                disabled={!userState}
                style={{ opacity: !userState ? 0.5 : 1 }}
              >{t.continue}</button>
            </motion.div>
          )}

          {step === 6 && (
            <motion.div key="step6" className="onboarding-content" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="onboarding-icon">🎉</div>
              <h2>{t.allSet}</h2>
              <p style={{ color: 'var(--text-secondary)' }}>{t.makeVoteCount} {country === 'India' ? '🇮🇳' : '🇺🇸'}</p>
              <button className="onboarding-btn" onClick={handleComplete}>{t.openCivic}</button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
