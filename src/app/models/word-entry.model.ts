import { Timestamp } from '@angular/fire/firestore';

export interface VocabularyEntry {
  word: string;
  definition: string;
}

export interface WordEntry {
  [key: string]: WordStats;
}

export interface WordStats {
  lastPracticed: Timestamp;
  nextPractice: Timestamp;
  masteryLevel: number;
  sentenceHistory: any[];
}
