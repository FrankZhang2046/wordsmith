import { Component, Input, effect, inject } from '@angular/core';
import { WordStats } from '../../models/word-entry.model';
import { WordService } from '../../services/word.service';

@Component({
  selector: 'app-word-bank-widget',
  standalone: true,
  imports: [],
  templateUrl: './word-bank-widget.component.html',
  styleUrl: './word-bank-widget.component.scss',
})
export class WordBankWidgetComponent {
  private wordService = inject(WordService);
  public wordBankEntries: WordStats[] = [];
  constructor() {
    effect(() => {
      this.wordBankEntries = this.wordService.wordBankEntriesSignal();
    });
  }
}
