import { Timestamp } from '@angular/fire/firestore';

export interface VocabularyEntry {
  word: string;
  definition: string;
}

export interface WordStats {
  word: string;
  lastPracticed: Timestamp;
  nextPractice: Timestamp;
  masteryLevel: number;
  sentenceHistory: any[];
}
