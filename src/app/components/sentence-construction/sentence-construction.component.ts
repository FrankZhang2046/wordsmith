import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ViewWordComponent } from '../view-word/view-word.component';
import { SentenceService } from '../../services/sentence.service';
import { WordSearchService } from '../../services/word-search.service';
import { WordEntry } from '../../model/word-entry.model';

@Component({
  selector: 'app-sentence-construction',
  standalone: true,
  templateUrl: './sentence-construction.component.html',
  styleUrl: './sentence-construction.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    ViewWordComponent,
  ],
})
export class SentenceConstructionComponent {
  public selectedWord: WordEntry | undefined;
  public sentenceForm: FormControl<string | null> = new FormControl<
    string | null
  >('');
  constructor(
    private sentenceService: SentenceService,
    private wordSearchService: WordSearchService
  ) {
    this.wordSearchService.selectedWordSubject.subscribe(
      (word) => (this.selectedWord = word)
    );
  }
  public formSubmit(event: Event) {
    event.preventDefault();
    console.log(this.sentenceForm.value);
    // make http request to cloud function
    // this.sentenceForm.reset();
    if (this.selectedWord && this.sentenceForm.value) {
      this.sentenceService.sentenceEvaluation(
        this.selectedWord?.word,
        this.sentenceForm.value
      );
    }
  }
}
