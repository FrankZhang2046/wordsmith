import { WordSearchService } from './../../services/word-search.service';
import {
  Component,
  ElementRef,
  Signal,
  ViewChild,
  WritableSignal,
  signal,
} from '@angular/core';
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
import { WordEntry } from '../../models/word-entry.model';
import { ViewWordComponent } from '../view-word/view-word.component';

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
  public selectedWord: WordEntry | undefined;
  constructor(
    private wordSearchService: WordSearchService,
    private firestore: Firestore
  ) {
    this.inputValue.valueChanges
      .pipe(
        // debounce for 300 ms
        debounceTime(300)
      )
      .subscribe((value) => {
        if (value) {
          this.filteredOptions = this.wordSearchService.fuzzySearchWord(value);
        } else if (value === '') {
          this.filteredOptions = undefined;
        }
      });

    this.wordSearchService.selectedWordSubject.subscribe(
      (wordEntry) => (this.selectedWord = wordEntry)
    );
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
      this.wordSearchService.selectedWordSubject.next(
        snapshot.docs[0].data() as WordEntry
      );
    });
  }
}
