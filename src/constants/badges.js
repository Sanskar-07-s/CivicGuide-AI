export const BADGES = [
  {
    id: "first_vote",
    name: "First Vote 🗳️",
    description: "Answer your first quiz question.",
    condition: (stats) => stats.totalQuestionsAnswered >= 1
  },
  {
    id: "on_fire",
    name: "On Fire 🔥",
    description: "Get 3 correct answers in a row.",
    condition: (stats) => stats.currentStreak >= 3
  },
  {
    id: "unstoppable",
    name: "Unstoppable ⚡",
    description: "Get 5 correct answers in a row.",
    condition: (stats) => stats.currentStreak >= 5
  },
  {
    id: "perfect_round",
    name: "Perfect Round 💯",
    description: "Score 5/5 in one session.",
    condition: (stats) => stats.correctAnswers >= 5 && stats.totalQuestionsAnswered === 5
  },
  {
    id: "democracy_nerd",
    name: "Democracy Nerd 🤓",
    description: "Answer 20 total questions.",
    condition: (stats) => stats.totalQuestionsAnswered >= 20
  },
  {
    id: "global_citizen",
    name: "Global Citizen 🌍",
    description: "Use multiple country modes.",
    condition: (stats) => stats.countriesUsed?.length > 1
  }
];

export const getRank = (scorePercentage) => {
  if (scorePercentage <= 20) return "Civic Newcomer 🌱";
  if (scorePercentage <= 40) return "Aware Citizen 📰";
  if (scorePercentage <= 60) return "Informed Voter 🗳️";
  if (scorePercentage <= 80) return "Civic Champion 🏅";
  return "Democracy Guardian 🏛️";
};
