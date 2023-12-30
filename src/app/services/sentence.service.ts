import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { InstructorFeedback } from '../model/instructor-feedback.model';

interface SentenceEvaluation {
  correct: boolean;
  feedback: string;
}

@Injectable({
  providedIn: 'root',
})
export class SentenceService {
  public instructorFeedback$: BehaviorSubject<InstructorFeedback | undefined> =
    new BehaviorSubject<InstructorFeedback | undefined>(undefined);
  constructor(private http: HttpClient) {}
  public async sentenceEvaluation(word: string, sentence: string) {
    const url =
      'http://127.0.0.1:5001/wordsmith-vocabulary-builder/us-central1/helloWorld';
    this.http.post(url, { word, sentence }).subscribe((res) => {
      this.instructorFeedback$.next(res as InstructorFeedback);
    });
  }
}
