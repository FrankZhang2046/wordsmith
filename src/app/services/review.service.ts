import {
  Injectable,
  Signal,
  WritableSignal,
  computed,
  effect,
  signal,
} from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  Firestore,
  collection,
  where,
  query,
  getDoc,
  doc,
  getDocs,
  Timestamp,
  orderBy,
} from '@angular/fire/firestore';
import { SentenceService } from './sentence.service';
import { DailyMissionWord, WordStats } from '../models/word-entry.model';
// import { WordService } from './word.service';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  public listOfWordsSignal: WritableSignal<WordStats[]> = signal<WordStats[]>(
    []
  );
  // public dailyMissionSignal: Signal<DailyMissionWord[]> = computed(() => {
  //   if (this.listOfWordsSignal().length > 0) {
  //     const dailyMissionWords = this.listOfWordsSignal()
  //       .filter((word, idx) => idx <= 2)
  //       .map((word) => ({ word, completed: false } as DailyMissionWord));
  //     console.log(`daily mission words: `, dailyMissionWords);

  //     return dailyMissionWords;
  //   } else {
  //     return [];
  //   }
  // });
  constructor(private firestore: Firestore, private auth: Auth) {}
  public async getReviewQueue(): Promise<void> {
    if (this.listOfWordsSignal().length > 0) {
      const tempList = this.listOfWordsSignal();
      tempList.shift();
      this.listOfWordsSignal.set([...tempList]);
    } else {
      await this.auth.authStateReady();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const wordsCollection = collection(
        this.firestore,
        `users/${this.auth.currentUser?.uid}/words`
      );
      const reviewQueueQuery = query(
        wordsCollection,
        where('nextPractice', '<=', Timestamp.fromDate(today))
      );
      getDocs(reviewQueueQuery).then((snapshot) => {
        const listOfWords = snapshot.docs
          .sort((a, b) => b.data()['masteryLevel'] - a.data()['masteryLevel'])
          .map((doc) => doc.data() as WordStats);
        console.log(`list of words: `, listOfWords);
        this.listOfWordsSignal.set(listOfWords);
      });
    }
  }

  public removeWordFormReviewQueue(word: string): void {
    console.log(`current word is: `, word);
    const filteredArr = this.listOfWordsSignal().filter(
      (wordStats) => wordStats.word !== word
    );
    console.log(`updated arr: `, filteredArr);
    this.listOfWordsSignal.set([...filteredArr]);
  }

  public flushListOfWordsSignal(): void {
    this.listOfWordsSignal.set([]);
  }
}
