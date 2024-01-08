import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ViewWordComponent } from '../view-word/view-word.component';
import { SentenceService } from '../../services/sentence.service';
import { WordService } from '../../services/word.service';
import { VocabularyEntry } from '../../models/word-entry.model';
import { FeedbackDisplayComponent } from '../feedback-display/feedback-display.component';
import { InstructorFeedback } from '../../models/instructor-feedback.model';

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
  ],
})
export class SentenceConstructionComponent {
  public selectedWord: VocabularyEntry | undefined;
  public prevRetry: boolean = false;
  public instructorFeedback = this.sentenceService.instructorFeedback;
  public sentenceForm: FormControl<string | null> = new FormControl<
    string | null
  >('');
  constructor(
    private sentenceService: SentenceService,
    private wordSearchService: WordService
  ) {
    const currentlySelectedWord = this.wordSearchService.selectedWordSignal();
    if (
      currentlySelectedWord &&
      currentlySelectedWord?.word !== this.selectedWord?.word
    ) {
      this.selectedWord = currentlySelectedWord;
      this.prevRetry = false;
    }
  }
  public async formSubmit(event: Event) {
    event.preventDefault();
    console.log(this.sentenceForm.value);
    if (this.selectedWord && this.sentenceForm.value) {
      await this.sentenceService.sentenceEvaluation(
        this.selectedWord?.word,
        this.sentenceForm.value,
        this.prevRetry
      );
      this.sentenceForm.reset();
    }
  }
}
