import { MatChipsModule } from '@angular/material/chips';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { WordImportStatus } from '../../models/word-entry.model';
import { ResolveChipBgColorPipe } from '../../pipes/resolve-chip-bg-color.pipe';
import { WordService } from '../../services/word.service';
import { firstValueFrom } from 'rxjs';
import { UtilitiesService } from '../../services/utilities.service';
@Component({
  selector: 'app-bulk-ingestion',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    ResolveChipBgColorPipe,
  ],
  templateUrl: './bulk-ingestion.component.html',
  styleUrl: './bulk-ingestion.component.scss',
})
export class BulkIngestionComponent {
  public bulkWordString = new FormControl<string>('');
  public displayProcessWordsListBtn: boolean = true;
  public displayDashboardNavBtn: boolean = false;
  public listOfWords: WordImportStatus[] = [];
  constructor(
    private wordService: WordService,
    private utilitiesService: UtilitiesService
  ) {}
  public printForm(event: Event) {
    event.preventDefault();
    this.listOfWords = this.returnListOfWords(this.bulkWordString.value || '');
  }

  public returnListOfWords(str: string): WordImportStatus[] {
    const wordList: string[] = [];
    str.split('\n').forEach((line) => {
      line
        .replace(/[^a-zA-Z]/g, '')
        .toLowerCase()
        .split(' ')
        .forEach((word) => {
          wordList.push(word);
        });
    });
    return wordList.map((word) => ({ word, imported: 'none', results: [] }));
  }

  public goToDashboard() {
    this.utilitiesService.navigateMethod('/dashboard');
    this.displayDashboardNavBtn = false;
  }

  public chipOnClickEventHandler(word: WordImportStatus) {
    if (word.imported === 'warn') {
      console.log(word);
    }
  }

  public async processWordsForBulkIngestion() {
    this.displayProcessWordsListBtn = false;
    for (const word of this.listOfWords) {
      const searchResults = await firstValueFrom(
        this.wordService.fuzzySearchWord(word.word)
      );
      word.results = searchResults;

      if (searchResults.length > 0) {
        if (searchResults[0].score === 0) {
          await this.wordService.addWordToWordBank(word.word);
          word.imported = 'done';
        } else {
          word.imported = 'warn';
        }
      }
    }
    this.displayDashboardNavBtn = true;
  }
}
