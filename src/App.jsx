import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  CheckSquare, 
  ChevronRight, 
  ArrowRight,
  ShieldCheck,
  Search,
  Moon,
  Sun,
  LogOut
} from 'lucide-react';
import ChatAssistant from './components/ChatAssistant';
import { Onboarding } from './components/Onboarding';
import { useTheme } from './hooks/useTheme';
import { translations } from './translations';
import './index.css';


const ThemeToggle = ({ theme, toggleTheme }) => (
  <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
    <motion.div
      initial={false}
      animate={{ rotate: theme === 'dark' ? 0 : 360, scale: theme === 'dark' ? 1 : 1.1 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
    </motion.div>
  </button>
);

const App = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userProfile, setUserProfile] = useState({
    userType: null,
    country: "India",
    userState: "",
    lang: "English"
  });
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onboarded = localStorage.getItem('civicguide_onboarded');
    if (!onboarded) {
      setShowOnboarding(true);
    } else {
      const savedProfile = localStorage.getItem('civicguide_profile');
      if (savedProfile) {
        try {
          setUserProfile(JSON.parse(savedProfile));
        } catch (e) {
          console.error("Error parsing profile", e);
        }
      }
    }
  }, []);

  const handleOnboardingComplete = (data) => {
    setUserProfile(data);
    setShowOnboarding(false);
  };

  const handleReset = () => {
    const confirmed = window.confirm(
      "This will reset your preferences and start over. Continue?"
    );
    if (confirmed) {
      localStorage.removeItem('civicguide_onboarded');
      localStorage.removeItem('civicguide_profile');
      setShowOnboarding(true);
    }
  };

  const lang = userProfile?.lang || 'English';
  const t = translations[lang].app;
  const STEPS_DATA = translations[lang].steps;
  
  const STEPS = STEPS_DATA.map((step, index) => {
    const ICONS = [<CheckSquare size={24} />, <Search size={24} />, <Calendar size={24} />, <MapPin size={24} />];
    const COLORS = ['#38bdf8', '#818cf8', '#c084fc', '#f472b6'];
    return { ...step, icon: ICONS[index], color: COLORS[index] };
  });

  return (
    <div className="app-container">
      {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}

      <div className="top-nav">
        {!showOnboarding && (
          <button 
            onClick={handleReset} 
            style={{ 
              background: 'var(--card-bg)', 
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)', 
              padding: '0.5rem 1rem', 
              borderRadius: '8px', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}
            aria-label={t.logout}
          >
            {t.logout}
          </button>
        )}
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </div>

      <header className="header">
        <div className="header-content">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="brand"
          >
            <ShieldCheck className="brand-icon" size={32} />
            <h2>Civic<span className="accent-gradient">Guide</span></h2>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="tagline text-muted"
          >
            {t.tagline}
          </motion.p>
        </div>
      </header>

      <main className="main-content">
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="hero-section text-center"
        >
          <h1 className="hero-title text-gradient">
            {t.heroTitle}
          </h1>
          <p className="hero-subtitle text-secondary">
            {t.heroSubtitle}
          </p>
        </motion.section>

        <div className="timeline-layout">
          <div className="timeline-nav">
            {STEPS.map((step, index) => (
              <motion.button
                key={step.id}
                onClick={() => setActiveStep(index)}
                className={`timeline-step-btn ${activeStep === index ? 'active' : ''}`}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                style={{ 
                  borderColor: activeStep === index ? step.color : 'var(--border-color)',
                  backgroundColor: activeStep === index ? 'var(--card-hover)' : 'transparent'
                }}
              >
                <div 
                  className="step-icon-wrapper"
                  style={{ 
                    color: activeStep === index ? '#fff' : step.color,
                    backgroundColor: activeStep === index ? step.color : 'transparent'
                  }}
                >
                  {step.icon}
                </div>
                <div className="step-info">
                  <h3 className="step-title">{step.title}</h3>
                  <span className="step-date text-muted">{step.date}</span>
                </div>
                {activeStep === index && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="active-indicator"
                    style={{ backgroundColor: step.color }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          <div className="step-details-container glass-panel">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="step-content"
              >
                <div className="step-header">
                  <div 
                    className="step-icon-large animate-float"
                    style={{ color: STEPS[activeStep].color }}
                  >
                    {STEPS[activeStep].icon}
                  </div>
                  <div>
                    <h2 className="step-detail-title">{STEPS[activeStep].title}</h2>
                    <p className="step-detail-date" style={{ color: STEPS[activeStep].color }}>
                      {STEPS[activeStep].date}
                    </p>
                  </div>
                </div>

                <p className="step-description text-secondary">
                  {STEPS[activeStep].description}
                </p>

                <div className="action-items">
                  <h4 className="action-title">Key Action Items</h4>
                  <ul className="action-list">
                    {STEPS[activeStep].details.map((detail, idx) => (
                      <motion.li 
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * idx }}
                        className="action-item"
                      >
                        <ChevronRight size={18} className="list-icon" style={{ color: STEPS[activeStep].color }} />
                        <span>{detail}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div className="step-footer">
                  <button 
                    className="primary-btn"
                    style={{ 
                      backgroundColor: STEPS[activeStep].color,
                      boxShadow: `0 4px 20px ${STEPS[activeStep].color}40`
                    }}
                  >
                    {t.learnMore} <ArrowRight size={16} />
                  </button>
                  {activeStep < STEPS.length - 1 && (
                    <button 
                      className="next-btn text-muted"
                      onClick={() => setActiveStep(prev => prev + 1)}
                    >
                      {t.nextStep} <ChevronRight size={16} />
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      <footer className="footer text-muted">
        <p>{t.footer}</p>
      </footer>

      <ChatAssistant initialProfile={userProfile} />
    </div>
  );
};

export default App;
