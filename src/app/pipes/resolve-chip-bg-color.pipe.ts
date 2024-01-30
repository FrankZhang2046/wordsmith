import { Pipe, PipeTransform } from '@angular/core';
import {
  SentenceHistoryEntry,
  WordImportStatus,
  WordStats,
} from '../models/word-entry.model';
import { Timestamp } from '@angular/fire/firestore';

@Pipe({
  name: 'resolveChipBgColor',
  standalone: true,
})
export class ResolveChipBgColorPipe implements PipeTransform {
  transform(word: WordImportStatus | SentenceHistoryEntry): string {
    if (word.hasOwnProperty('imported')) {
      switch ((word as WordImportStatus).imported) {
        case 'done':
          return '!bg-green-400';
        case 'warn':
          return '!bg-yellow-400';
        case 'discard':
          return '!bg-red-400';
        default:
          return '';
      }
    } else {
      switch ((word as SentenceHistoryEntry).correct) {
        case true:
          return '!bg-green-400';
        case false:
          return '!bg-red-400';
        default:
          return '';
      }
    }
  }
}
