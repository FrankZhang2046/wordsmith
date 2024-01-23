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
  onSnapshot,
  query,
  getDoc,
  doc,
  getDocs,
  Timestamp,
  orderBy,
} from '@angular/fire/firestore';
import { SentenceService } from './sentence.service';
import { DailyMissionWord } from '../models/word-entry.model';
// import { WordService } from './word.service';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  public listOfWordsSignal: WritableSignal<string[]> = signal<string[]>([]);
  public dailyMissionSignal: Signal<DailyMissionWord[]> = computed(() => {
    if (this.listOfWordsSignal().length > 0) {
      const dailyMissionWords = this.listOfWordsSignal()
        .filter((word, idx) => idx <= 2)
        .map((word) => ({ word, completed: false } as DailyMissionWord));
      console.log(`daily mission words: `, dailyMissionWords);

      return dailyMissionWords;
    } else {
      return [];
    }
  });
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
        this.listOfWordsSignal.set(
          snapshot.docs
            .sort((a, b) => b.data()['masteryLevel'] - a.data()['masteryLevel'])
            .map((doc) => doc.data()['word'])
        );
      });
    }
  }
}
