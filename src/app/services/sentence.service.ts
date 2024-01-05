import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { InstructorFeedback } from '../models/instructor-feedback.model';
import { environment } from '../../environments/environment';

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
  public async sentenceEvaluation(
    word: string,
    sentence: string,
    provideExample: boolean
  ) {
    let url: string;
    console.log(`environment is production: `, environment.production);
    if (environment.production) {
      url = 'https://helloworld-5e7r32bc5a-uc.a.run.app';
    } else {
      url =
        'http://127.0.0.1:5001/wordsmith-vocabulary-builder/us-central1/helloWorld';
    }
    this.http.post(url, { word, sentence, provideExample }).subscribe((res) => {
      this.instructorFeedback$.next(res as InstructorFeedback);
    });
  }
}
