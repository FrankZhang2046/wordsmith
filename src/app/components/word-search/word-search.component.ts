import { WordService } from '../../services/word.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, debounce, debounceTime, tap } from 'rxjs';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import {
  Firestore,
  collection,
  onSnapshot,
  query,
  where,
} from '@angular/fire/firestore';
import { VocabularyEntry } from '../../models/word-entry.model';
import { ViewWordComponent } from '../view-word/view-word.component';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-word-search',
  standalone: true,
  templateUrl: './word-search.component.html',
  styleUrl: './word-search.component.scss',
  imports: [
    CommonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    ViewWordComponent,
  ],
})
export class WordSearchComponent {
  public inputValue: FormControl<string | null> = new FormControl('');
  public filteredOptions: Observable<string[]> | undefined;
  public selectedWord = this.wordService.selectedWordSignal;
  constructor(
    private wordService: WordService,
    private firestore: Firestore,
    private reviewService: ReviewService
  ) {
    this.inputValue.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
      if (value) {
        this.filteredOptions = this.wordService.fuzzySearchWord(value);
      } else if (value === '') {
        this.filteredOptions = undefined;
      }
    });
  }
  public matOptionClickEventHandler(
    selectedOption: MatAutocompleteSelectedEvent
  ) {
    // reset input component value
    this.inputValue.setValue('');
    this.searchWordInDb(selectedOption.option.value);
  }
  public searchWordInDb(word: string) {
    const vocabularyCol = collection(this.firestore, 'vocabularies');

    onSnapshot(query(vocabularyCol, where('word', '==', word)), (snapshot) => {
      this.wordService.selectedWordSignal.set(
        snapshot.docs[0].data() as VocabularyEntry
      );
    });
  }
}
