import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ViewWordComponent } from '../view-word/view-word.component';
import { SentenceService } from '../../services/sentence.service';
import { WordSearchService } from '../../services/word-search.service';
import { WordEntry } from '../../model/word-entry.model';
import { FeedbackDisplayComponent } from '../feedback-display/feedback-display.component';
import { BehaviorSubject } from 'rxjs';
import { InstructorFeedback } from '../../model/instructor-feedback.model';

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
  public selectedWord: WordEntry | undefined;
  public instructorFeedback: InstructorFeedback | undefined;
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
    this.sentenceService.instructorFeedback$.subscribe(
      (feedback) => (this.instructorFeedback = feedback)
    );
  }
  public async formSubmit(event: Event) {
    event.preventDefault();
    console.log(this.sentenceForm.value);
    if (this.selectedWord && this.sentenceForm.value) {
      await this.sentenceService.sentenceEvaluation(
        this.selectedWord?.word,
        this.sentenceForm.value
      );
      this.sentenceForm.reset();
    }
  }
}
