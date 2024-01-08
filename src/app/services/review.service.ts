import { Injectable } from '@angular/core';
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

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  constructor(private firestore: Firestore, private auth: Auth) {}
  public async getReviewQueue(): Promise<void> {
    await this.auth.authStateReady();
    console.log(`auth state is ready, `, this.auth.currentUser?.email);

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
      snapshot.docs
        .sort((a, b) => b.data()['masteryLevel'] - a.data()['masteryLevel'])
        .forEach((doc) => console.log(doc.data()));
    });
  }
}
