import { Pipe, PipeTransform } from '@angular/core';
import { WordImportStatus } from '../models/word-entry.model';

@Pipe({
  name: 'resolveChipBgColor',
  standalone: true,
})
export class ResolveChipBgColorPipe implements PipeTransform {
  transform(word: WordImportStatus): string {
    switch (word.imported) {
      case 'done':
        return '!bg-green-400';
      case 'warn':
        return '!bg-yellow-400';
      case 'discard':
        return '!bg-red-400';
      default:
        return '';
    }
  }
}
