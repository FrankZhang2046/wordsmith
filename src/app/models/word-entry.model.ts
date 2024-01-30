import { Timestamp } from '@angular/fire/firestore';
import { FuseResult } from 'fuse.js';

export interface VocabularyEntry {
  word: string;
  definition: string;
}

export interface WordStats {
  word: string;
  lastPracticed: Timestamp;
  nextPractice: Timestamp;
  dateAdded: Timestamp;
  masteryLevel: number;
  sentenceHistory: {
    correct: boolean;
    feedback: string;
    sentence: string;
    timestamp: Timestamp;
  }[];
  currentInterval: number;
}

export interface WordImportStatus {
  word: string;
  imported: 'done' | 'none' | 'warn' | 'discard';
  results: FuseResult<string>[];
}

export interface DailyMissionWord {
  word: string;
  completed: boolean;
}
