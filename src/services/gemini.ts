import { GoogleGenAI } from "@google/genai";
import { MatchRecord, UserProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzePerformance(profile: UserProfile, matches: MatchRecord[]) {
  const matchSummary = matches.map(m => 
    `Hero: ${m.heroId}, Result: ${m.result}, K/D/A: ${m.eliminations}/${m.deaths}/${m.assists}, Dmg: ${m.damage}, Heal: ${m.healing}, Blocked: ${m.damageBlocked}`
  ).join('\n');

  const prompt = `
    You are a professional Marvel Rivals coach. Analyze the following player performance data and provide a personalized playstyle recommendation.
    
    Player Profile:
    - Favorite Hero: ${profile.favoriteHero || 'Unknown'}
    - Win Rate: ${profile.winRate}%
    - Skill Rating: ${profile.skillRating}
    
    Recent Matches:
    ${matchSummary}
    
    Provide your analysis in Markdown format. Include:
    1. **Strengths**: What the player is doing well.
    2. **Weaknesses**: Areas for improvement.
    3. **Optimal Playstyle**: Which heroes or roles they should focus on based on their stats.
    4. **Pro Tip**: A specific high-level tip for their favorite hero.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Failed to generate analysis. Please try again later.";
  }
}
