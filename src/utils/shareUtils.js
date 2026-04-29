export const generateShareCardText = (stats) => {
  const { correctAnswers, totalQuestionsAnswered, currentStreak, badgesEarned } = stats;
  const scorePercentage = totalQuestionsAnswered > 0 
    ? Math.round((correctAnswers / totalQuestionsAnswered) * 100) 
    : 0;

  let rank = "Civic Newcomer 🌱";
  if (scorePercentage > 20) rank = "Aware Citizen 📰";
  if (scorePercentage > 40) rank = "Informed Voter 🗳️";
  if (scorePercentage > 60) rank = "Civic Champion 🏅";
  if (scorePercentage > 80) rank = "Democracy Guardian 🏛️";

  // Get badge emojis
  const badgeEmojis = badgesEarned.length > 0 
    ? badgesEarned.map(b => {
        if (b === "first_vote") return "🗳️";
        if (b === "on_fire") return "🔥";
        if (b === "unstoppable") return "⚡";
        if (b === "perfect_round") return "💯";
        if (b === "democracy_nerd") return "🤓";
        if (b === "global_citizen") return "🌍";
        return "🌟";
      }).join(" ")
    : "🌱";

  return `🗳️ CivicGuide AI — Civic Knowledge Score

Score: ${correctAnswers}/${totalQuestionsAnswered} (${scorePercentage}%) 🏅
Rank: ${rank}
Streak: 🔥 ${currentStreak} in a row
Badges: ${badgeEmojis}

"Democracy works when citizens are informed."

Built with Google Gemini AI + Google Antigravity
Try it: PromptWars by Hack2Skill
#PromptWars #CivicGuide #Hack2Skill #BuildInPublic`;
};
