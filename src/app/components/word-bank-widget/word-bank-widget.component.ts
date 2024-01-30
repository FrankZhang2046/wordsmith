import { Component, Input, effect, inject } from '@angular/core';
import { WordStats } from '../../models/word-entry.model';
import { WordService } from '../../services/word.service';
import { MatListModule, MatSelectionListChange } from '@angular/material/list';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { debounceTime } from 'rxjs';
import Fuse from 'fuse.js';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-word-bank-widget',
  standalone: true,
  imports: [
    MatListModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatTableModule,
  ],
  templateUrl: './word-bank-widget.component.html',
  styleUrl: './word-bank-widget.component.scss',
})
export class WordBankWidgetComponent {
  private wordService = inject(WordService);
  private router = inject(Router);
  public displayColumns = ['word', 'mastery', 'control'];
  public wordBankEntries: WordStats[] = [];
  public hoveredOverWord: WordStats | null = null;
  public headerSticky = true;
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
          const resultArr = fuse.search(value);
          if (resultArr[0].item.word === value) {
            this.filteredWordBankEntries = [resultArr[0].item];
          } else {
            this.filteredWordBankEntries = resultArr.map(
              (result) => result.item
            );
          }
        } else {
          this.filteredWordBankEntries = [];
        }
      });
  }
  public printWordEntry(event: MatSelectionListChange) {
    event.options.forEach((option) => console.log(option.value));
  }
  public registerHoveredOverWord(row: WordStats | null) {
    this.hoveredOverWord = row;
  }
  public viewWordDetails(word: WordStats): void {
    this.router.navigate([`word-detail/${word.word}`]);
  }
}
