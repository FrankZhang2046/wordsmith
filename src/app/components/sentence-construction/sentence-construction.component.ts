import { ReviewService } from './../../services/review.service';
import {
  Component,
  Signal,
  WritableSignal,
  computed,
  effect,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ViewWordComponent } from '../view-word/view-word.component';
import { SentenceService } from '../../services/sentence.service';
import { WordService } from '../../services/word.service';
import { VocabularyEntry } from '../../models/word-entry.model';
import { FeedbackDisplayComponent } from '../feedback-display/feedback-display.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    FeedbackDisplayComponent,
    MatProgressSpinnerModule,
  ],
})
export class SentenceConstructionComponent {
  public selectedWord: VocabularyEntry | undefined;
  public prevRetry: boolean = false;
  public instructorFeedback = this.sentenceService.instructorFeedbackSignal;
  public displayTextarea: boolean = true;
  public cachedSentence: string = '';
  public sentenceForm: FormControl<string | null> = new FormControl<
    string | null
  >('');
  public displayLoadingSpinner: boolean = false;

  constructor(
    private sentenceService: SentenceService,
    private wordSearchService: WordService
  ) {
    effect(() => {
      const feedback = this.instructorFeedback();
      if (!feedback?.correct) {
        this.displayTextarea = false;
        this.prevRetry = true;
        this.displayLoadingSpinner = false;
      } else {
        // * if the feedback is correct, no need to render the textarea again
        this.displayLoadingSpinner = false;
      }
    });
    effect(() => {
      const currentlySelectedWord = this.wordSearchService.selectedWordSignal();
      if (
        currentlySelectedWord &&
        currentlySelectedWord?.word !== this.selectedWord?.word
      ) {
        this.selectedWord = currentlySelectedWord;
        this.prevRetry = false;
        this.displayTextarea = true;
      }
    });
  }
  public async formSubmit(event: Event) {
    event.preventDefault();
    if (this.selectedWord && this.sentenceForm.value) {
      this.displayTextarea = false;
      this.displayLoadingSpinner = true;
      this.cachedSentence = this.sentenceForm.value;
      await this.sentenceService.sentenceEvaluation(
        this.selectedWord?.word,
        this.sentenceForm.value,
        this.prevRetry
      );
      this.sentenceForm.reset();
    }
  }
}
