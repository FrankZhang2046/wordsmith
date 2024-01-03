import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  Firestore,
  collection,
  where,
  onSnapshot,
  query,
  Timestamp,
  getDocs,
  getDoc,
  doc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  constructor(private firestore: Firestore, private auth: Auth) {}
  public getReviewQueue(): void {
    console.log(`running that method`);

    const today = new Date('2024-01-01');
    today.setHours(0, 0, 0, 0);
    console.log(`uid: `, this.auth.currentUser?.uid);

    const wordsCollection = collection(
      this.firestore,
      `users/${this.auth.currentUser?.uid}/words`
    );
    const docPath = `/users/${this.auth.currentUser?.uid}/words/kill`;
    console.log(`docPath: `, docPath);
    const wordDocRef = doc(this.firestore, docPath);
    const reviewQueueQuery = query(
      wordsCollection,
      where('word', '!=', 'fuck')
    );
    getDoc(wordDocRef).then((snapshot) => console.log(snapshot.data()));
  }
}
