import type { SOCIAL_PLATFORMS } from './constants';

export type SocialPlatform = typeof SOCIAL_PLATFORMS[keyof typeof SOCIAL_PLATFORMS];

export interface CatFact {
  fact: string;
  length: number;
}

export interface SavedFact {
  id: string;
  fact: string;
  rating: number;
  savedAt: number;
}

export interface Theme {
  bg: string;
  cardBg: string;
  text: string;
  textSecondary: string;
  accent: string;
  accentHover: string;
  border: string;
  buttonBg: string;
  shadow: string;
  deleteBtn: string;
  deleteBtnHover: string;
  deleteIcon: string;
}