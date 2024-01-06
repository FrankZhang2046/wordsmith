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
    // get data for the correct word entry
    const wordsCollection = await this.getWordBankCollection();
    const wordEntryDocument = doc(wordsCollection, word);
    const wordEntry = await getDoc(wordEntryDocument);
    const wordEntryData = wordEntry.data() as WordStats;
    /*
      - update sentenceHistory
      - lastPractice updated to today

      if user failed to construct a correct sentence
      - do nothing

      if it took multiple tries for the user to construct a correct sentence, 
      - masteryLevel stays the same, 
      - increment currentInterval by 1.2 * currentInterval
      - increment nextPractice by currentInterval days 

      if user constructed a correct sentence the first time
      - increment masteryLevel by 1
      - increment currentInterval by 2 * currentInterval
      - increment nextPractice by currentInterval days 
    */

    wordEntryData.sentenceHistory.push({
      ...res,
      sentence,
      timestamp: Timestamp.now(),
    });
    wordEntryData.lastPracticed = Timestamp.now();

    if (res.correct) {
      if (prevRetried) {
        wordEntryData.currentInterval = wordEntryData.currentInterval * 1.2;
      } else {
        wordEntryData.masteryLevel += 1;
        wordEntryData.currentInterval = wordEntryData.currentInterval * 2;
      }
      wordEntryData.nextPractice = this.updateNextPracticeTime(
        wordEntryData,
        wordEntryData.currentInterval
      );
    }
    updateDoc(wordEntryDocument, { ...wordEntryData });
  }

  public updateNextPracticeTime(
    wordEntry: WordStats,
    intervalInDays: number
  ): Timestamp {
    const currentPracticeTime = new Date();
    const nextPracticeTime =
      wordEntry.nextPractice.toMillis() + intervalInDays * 24 * 60 * 60 * 1000;
    return Timestamp.fromMillis(nextPracticeTime);
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
