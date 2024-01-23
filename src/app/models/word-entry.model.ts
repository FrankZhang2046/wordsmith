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
  masteryLevel: number;
  sentenceHistory: any[];
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
