import { PpAuthLibComponent, PpAuthLibService } from 'pp-auth-lib';
import { Injectable, WritableSignal, signal } from '@angular/core';
import Fuse from 'fuse.js';
import { listOfWords } from '../data/listOfWords';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { log } from 'console';
import { VocabularyEntry, WordStats } from '../models/word-entry.model';
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  Firestore,
  Timestamp,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { InstructorFeedback } from '../models/instructor-feedback.model';

@Injectable({
  providedIn: 'root',
})
export class WordService {
  public selectedWordSubject: BehaviorSubject<VocabularyEntry | undefined> =
    new BehaviorSubject<VocabularyEntry | undefined>(undefined);
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private ppAuthLibService: PpAuthLibService
  ) {}
  public async addWordToWordBank(
    word: string
  ): Promise<DocumentSnapshot | string> {
    // grab the correct collection for the user
    const user = await this.ppAuthLibService.getCurrentUser();
    const wordBankCollection = await this.getWordBankCollection();
    // if the collection has a document with word as the key, return the document, if not, create it
    const wordEntryDocument = await this.getWordDocRef(
      wordBankCollection,
      word
    );
    return getDoc(wordEntryDocument).then((doc) => {
      if (doc.exists()) {
        return doc;
      } else {
        const newWordEntry: WordStats = {
          word,
          lastPracticed: Timestamp.now(),
          nextPractice: Timestamp.now(),
          masteryLevel: 1,
          sentenceHistory: [],
          currentInterval: 1,
        };
        setDoc(wordEntryDocument, newWordEntry);
        return 'doc created';
      }
    });
  }

  public async getWordBankCollection(): Promise<CollectionReference> {
    const user = await this.ppAuthLibService.getCurrentUser();
    return collection(this.firestore, `users/${user?.uid}/words/`);
  }

  public async getWordDocRef(
    collectionRef: CollectionReference,
    path: string
  ): Promise<DocumentReference> {
    return doc(collectionRef, path);
  }

  public async updateWordStats(
    word: string,
    sentence: string,
    res: InstructorFeedback,
    prevRetried: boolean
  ) {
    // logic for when the user has created a correct sentence
    const wordsCollection = await this.getWordBankCollection();
    const wordEntryDocument = doc(wordsCollection, word);
    const wordEntry = await getDoc(wordEntryDocument);
    const wordEntryData = wordEntry.data() as WordStats;
    wordEntryData.sentenceHistory.push({
      ...res,
      sentence,
      timestamp: Timestamp.now(),
    });
    wordEntryData.masteryLevel += 1;
    if (res.correct) {
      wordEntryData.nextPractice = this.updateNextPracticeTime(
        wordEntryData,
        10
      );
    }
    updateDoc(wordEntryDocument, { ...wordEntryData });
  }

  public updateNextPracticeTime(wordEntry: WordStats, days: number): Timestamp {
    const currentPracticeTime = new Date();
    const nextPracticeTime =
      wordEntry.nextPractice.toMillis() + days * 24 * 60 * 60 * 1000;
    const newTimestamp = Timestamp.fromMillis(nextPracticeTime);
    console.log(`new timestamp: `, currentPracticeTime, newTimestamp);
    return newTimestamp;
  }

  public fuzzySearchWord(letters: string): Observable<string[]> {
    const fuse = new Fuse(listOfWords, { includeScore: true });
    const searchResult = fuse
      .search(letters)
      .slice(0, 11)
      .map((word) => word.item);
    return of(searchResult);
  }
}
