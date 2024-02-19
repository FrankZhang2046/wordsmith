import { WordService } from '../../services/word.service';
import { Component, inject } from '@angular/core';
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
  getDoc,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';
import { VocabularyEntry } from '../../models/word-entry.model';
import { ViewWordComponent } from '../view-word/view-word.component';
import { ReviewService } from '../../services/review.service';
import { FuseResult } from 'fuse.js';
import { TourMatMenuModule, TourService } from 'ngx-ui-tour-md-menu';

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
    TourMatMenuModule,
  ],
})
export class WordSearchComponent {
  public inputValue: FormControl<string | null> = new FormControl('');
  private tourService = inject(TourService);
  public filteredOptions: Observable<FuseResult<string>[]> | undefined;
  public selectedWord = this.wordService.selectedWordSignal;
  constructor(
    private wordService: WordService,
    private firestore: Firestore,
    private reviewService: ReviewService
  ) {
    this.tourService.initialize([
      {
        anchorId: 'some.anchor.id',
        content: 'Some content',
        title: 'First',
      },
      {
        anchorId: 'another.anchor.id',
        content: 'Other content',
        title: 'Second',
      },
    ]);

    // this.tourService.start();
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
    const wordQuery = query(vocabularyCol, where('word', '==', word));

    getDocs(wordQuery).then((snapshot) => {
      this.wordService.selectedWordSignal.set(
        snapshot.docs[0].data() as VocabularyEntry
      );
    });
  }
}
