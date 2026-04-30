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
import './index.css';

const STEPS = [
  {
    id: 'registration',
    title: 'Voter Registration',
    icon: <CheckSquare size={24} />,
    date: 'Sep 1 - Oct 15',
    description: 'Ensure you are registered to vote at your current address. Check deadlines for your specific state.',
    details: [
      'Check your current registration status online.',
      'Update your address if you have moved recently.',
      'Bring necessary ID if registering in person.',
      'Online registration is available in 42 states.'
    ],
    color: '#38bdf8'
  },
  {
    id: 'research',
    title: 'Candidate Research',
    icon: <Search size={24} />,
    date: 'Oct 15 - Nov 1',
    description: 'Learn about the candidates, their platforms, and key ballot measures in your district.',
    details: [
      'Review non-partisan voter guides.',
      'Watch local and national debates.',
      'Understand the impacts of proposed propositions.',
      'Check endorsements from trusted organizations.'
    ],
    color: '#818cf8'
  },
  {
    id: 'early-voting',
    title: 'Early Voting (Optional)',
    icon: <Calendar size={24} />,
    date: 'Oct 20 - Nov 4',
    description: 'Avoid the lines by voting early if your state permits it, or request an absentee ballot.',
    details: [
      'Find your early voting polling location.',
      'Check the operating hours (often different from Election Day).',
      'Request a mail-in ballot before the deadline.',
      'Track your mail-in ballot online.'
    ],
    color: '#c084fc'
  },
  {
    id: 'election-day',
    title: 'Election Day',
    icon: <MapPin size={24} />,
    date: 'November 5th',
    description: 'Head to your designated polling place to cast your vote. Polls usually open at 7 AM and close at 8 PM.',
    details: [
      'Verify your specific polling location beforehand.',
      'Bring required identification (varies by state).',
      'If you are in line when polls close, STAY IN LINE.',
      'If you encounter issues, ask for a provisional ballot.'
    ],
    color: '#f472b6'
  }
];

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
    }
  }, []);

  const handleOnboardingComplete = (data) => {
    setUserProfile(data);
    setShowOnboarding(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('civicguide_onboarded');
    setShowOnboarding(true);
  };

  return (
    <div className="app-container">
      {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}

      <div className="top-nav">
        {!showOnboarding && (
          <button 
            onClick={handleLogout} 
            style={{ 
              marginRight: '1rem', 
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
            aria-label="Log out"
          >
            <LogOut size={16} /> Log out
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
            Your interactive assistant for navigating the election process.
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
            Democracy, Simplified.
          </h1>
          <p className="hero-subtitle text-secondary">
            Follow our interactive timeline to ensure your voice is heard. 
            From registration to ballot casting, we've got you covered.
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
                    Learn More <ArrowRight size={16} />
                  </button>
                  {activeStep < STEPS.length - 1 && (
                    <button 
                      className="next-btn text-muted"
                      onClick={() => setActiveStep(prev => prev + 1)}
                    >
                      Next Step <ChevronRight size={16} />
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      <footer className="footer text-muted">
        <p>This is an informational assistant. Always verify deadlines with your local election office.</p>
      </footer>

      <ChatAssistant initialProfile={userProfile} />
    </div>
  );
};

export default App;
