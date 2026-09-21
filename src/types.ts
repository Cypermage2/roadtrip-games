export type GameMode = 
  | 'menu' 
  | 'road_trip_questions' 
  | 'would_you_rather' 
  | 'license_plate' 
  | 'tarot';

export interface RoadTripQuestion {
  id: string;
  question: string;
  category: string;
  categoryColor: string;
  diceRollTrigger?: number;
  tip?: string;
}

export interface WouldYouRatherQuestion {
  id: string;
  scenario?: string;
  optionA: string;
  optionB: string;
  category: string;
  categoryColor: string;
}

export interface GameStats {
  rollsCount: number;
  favoriteQuestions: string[];
}

export type TarotArcana = 'major' | 'minor';
export type TarotSuit = 'major' | 'wands' | 'cups' | 'swords' | 'pentacles';

export interface TarotCard {
  id: string;
  name: string;
  numberStr: string;
  arcana: TarotArcana;
  suit: TarotSuit;
  element: string;
  tagline: string;
  uprightMeaning: string;
  reversedMeaning: string;
  uprightKeywords: string[];
  reversedKeywords: string[];
  advice: string;
  reflection: string;
  affirmation: string;
  leans: 'Yes' | 'No' | 'Pause' | 'It depends';
  themeColor: string;
  symbol: string;
}

export type TarotSpreadType = 
  | 'single' 
  | 'past_present_future' 
  | 'situation_action_outcome' 
  | 'mind_body_spirit';

export interface SpreadPositionDef {
  title: string;
  job: string;
  question: string;
}

export interface SpreadDef {
  id: TarotSpreadType;
  title: string;
  cardCount: 1 | 3;
  description: string;
  positions: SpreadPositionDef[];
}

export interface DrawnCardSlot {
  positionIndex: number;
  positionName: string;
  positionJob: string;
  card: TarotCard | null;
  isReversed: boolean;
}

