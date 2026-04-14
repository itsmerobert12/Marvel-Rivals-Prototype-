export type HeroRole = 'Vanguard' | 'Duelist' | 'Strategist';

export interface Hero {
  id: string;
  name: string;
  role: HeroRole;
  description: string;
  abilities: Ability[];
  teamUps: TeamUp[];
  stats: {
    difficulty: number;
    damage: number;
    survivability: number;
    mobility: number;
    utility: number;
  };
  imageUrl: string;
}

export interface Ability {
  name: string;
  description: string;
  type: 'Passive' | 'Primary' | 'Secondary' | 'Ultimate';
}

export interface TeamUp {
  heroId: string;
  description: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: 'user' | 'admin';
  skillRating: number;
  favoriteHero?: string;
  totalMatches: number;
  winRate: number;
  lastAnalyzed?: string;
}

export interface MatchRecord {
  id: string;
  userId: string;
  heroId: string;
  damage: number;
  healing: number;
  damageBlocked: number;
  eliminations: number;
  deaths: number;
  assists: number;
  result: 'win' | 'loss' | 'draw';
  timestamp: string;
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  skillRating: number;
  favoriteHero?: string;
  rank?: number;
}
