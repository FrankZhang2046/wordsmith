import { WordSearchService } from './../../services/word-search.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-word-search',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
  ],
  templateUrl: './word-search.component.html',
  styleUrl: './word-search.component.scss',
})
export class WordSearchComponent {
  public inputValue: FormControl<string | null> = new FormControl('');
  public filteredOptions: Observable<string[]> | undefined;
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
      // console.log data
      snapshot.forEach((doc) => {
        console.log(doc.data());
      });
    });
  }
}
