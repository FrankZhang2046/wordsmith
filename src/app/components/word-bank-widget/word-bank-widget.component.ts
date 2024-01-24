import { Component, Input, effect, inject } from '@angular/core';
import { WordStats } from '../../models/word-entry.model';
import { WordService } from '../../services/word.service';
import { MatListModule, MatSelectionListChange } from '@angular/material/list';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { debounceTime } from 'rxjs';
import Fuse from 'fuse.js';

@Component({
  selector: 'app-word-bank-widget',
  standalone: true,
  imports: [MatListModule, ReactiveFormsModule, MatInputModule],
  templateUrl: './word-bank-widget.component.html',
  styleUrl: './word-bank-widget.component.scss',
})
export class WordBankWidgetComponent {
  private wordService = inject(WordService);
  public wordBankEntries: WordStats[] = [];
  public filteredWordBankEntries: WordStats[] = [];
  public wordBankSearchString: FormControl<string | null> = new FormControl('');
  constructor() {
    effect(() => {
      this.wordBankEntries = this.wordService.wordBankEntriesSignal();
    });

    this.wordBankSearchString.valueChanges
      .pipe(debounceTime(300))
      .subscribe((value) => {
        if (value) {
          const fuse = new Fuse(this.wordBankEntries, {
            includeScore: true,
            keys: ['word'],
          });
          this.filteredWordBankEntries = fuse
            .search(value)
            .map((result) => result.item);
          console.log(`filtered results: `, this.filteredWordBankEntries);
        }
      });
  }
  public printWordEntry(event: MatSelectionListChange) {
    event.options.forEach((option) => console.log(option.value));
  }
}
