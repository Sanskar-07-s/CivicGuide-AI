import { useState, useEffect, useCallback } from 'react';
import { BADGES } from '../constants/badges';

export const useQuizStats = () => {
  const [stats, setStats] = useState(() => {
    try {
      const saved = localStorage.getItem('civicguide_stats');
      return saved ? JSON.parse(saved) : {
        totalQuestionsAnswered: 0,
        correctAnswers: 0,
        currentStreak: 0,
        bestStreak: 0,
        badgesEarned: [],
        countriesUsed: []
      };
    } catch (e) {
      console.error("Error parsing stats", e);
      return {
        totalQuestionsAnswered: 0,
        correctAnswers: 0,
        currentStreak: 0,
        bestStreak: 0,
        badgesEarned: [],
        countriesUsed: []
      };
    }
  });

  const [newBadge, setNewBadge] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('civicguide_stats', JSON.stringify(stats));
    } catch (e) {
      console.error("Error saving stats", e);
    }
  }, [stats]);

  const updateStats = useCallback((isCorrect, country) => {
    setStats(prev => {
      const currentStreak = isCorrect ? prev.currentStreak + 1 : 0;
      const bestStreak = Math.max(prev.bestStreak, currentStreak);
      const countriesUsed = prev.countriesUsed.includes(country) 
        ? prev.countriesUsed 
        : [...prev.countriesUsed, country];

      const newStats = {
        ...prev,
        totalQuestionsAnswered: prev.totalQuestionsAnswered + 1,
        correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
        currentStreak,
        bestStreak,
        countriesUsed
      };

      // Check for new badges
      const newlyEarnedBadges = BADGES.filter(b => 
        !prev.badgesEarned.includes(b.id) && b.condition(newStats)
      );

      if (newlyEarnedBadges.length > 0) {
        setNewBadge(newlyEarnedBadges[0]);
        setTimeout(() => setNewBadge(null), 3000);
        newStats.badgesEarned = [...prev.badgesEarned, ...newlyEarnedBadges.map(b => b.id)];
      }

      return newStats;
    });
  }, []);

  const civicScore = stats.totalQuestionsAnswered > 0 
    ? Math.round((stats.correctAnswers / stats.totalQuestionsAnswered) * 100) 
    : 0;

  return { stats, updateStats, civicScore, newBadge };
};
