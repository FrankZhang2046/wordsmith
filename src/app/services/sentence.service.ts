import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal, signal } from '@angular/core';
import { InstructorFeedback } from '../models/instructor-feedback.model';
import { environment } from '../../environments/environment';
import { WordService } from './word.service';

interface SentenceEvaluation {
  correct: boolean;
  feedback: string;
}

@Injectable({
  providedIn: 'root',
})
export class SentenceService {
  public instructorFeedbackSignal: WritableSignal<
    InstructorFeedback | undefined
  > = signal<InstructorFeedback | undefined>(undefined);
  constructor(private http: HttpClient, private wordService: WordService) {
    // setTimeout(() => {
    //   console.log(`injecting a fake feedback`);
    //   this.injectFakeFeedback();
    // }, 0);
  }

  public flushInstructorFeedbackSignal(): void {
    this.instructorFeedbackSignal.set(undefined);
  }
  public async sentenceEvaluation(
    word: string,
    sentence: string,
    provideExample: boolean
  ) {
    let url: string;
    if (environment.production) {
      url = 'https://evaluatesentence-5e7r32bc5a-uc.a.run.app';
    } else {
      url =
        'http://127.0.0.1:5001/wordsmith-vocabulary-builder/us-central1/evaluateSentence';
    }
    this.http.post(url, { word, sentence, provideExample }).subscribe((res) => {
      this.instructorFeedbackSignal.set(res as InstructorFeedback);
      this.wordService.updateWordStats(
        word,
        sentence,
        res as InstructorFeedback,
        provideExample
      );
    });
  }

  private injectFakeFeedback() {
    console.log(`injecting a fake feedback.`);

    this.instructorFeedbackSignal.set({
      correct: false,
      feedback:
        'this is a fake feedback message. This is a very fake feedback message.',
    });
  }
}
