import { getRank } from '../constants/badges';

export const ProgressTracker = ({ stats }) => {
  const scorePercentage = stats.totalQuestionsAnswered > 0 
    ? Math.round((stats.correctAnswers / stats.totalQuestionsAnswered) * 100) 
    : 0;

  return (
    <div className="quiz-stats-bar">
      <div className="stats-item stats-streak">
        🔥 Streak: {stats.currentStreak}
      </div>
      <div className="stats-item">
        ✅ {stats.correctAnswers}/{stats.totalQuestionsAnswered}
      </div>
      <div className="stats-item stats-score">
        Score: {scorePercentage}%
      </div>
      <div className="stats-item">
        Rank: {getRank(scorePercentage)}
      </div>
    </div>
  );
};
