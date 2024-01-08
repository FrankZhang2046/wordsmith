import { PpAuthLibService } from 'pp-auth-lib';
import { Injectable, WritableSignal, effect, signal } from '@angular/core';
import Fuse from 'fuse.js';
import { listOfWords } from '../data/listOfWords';
import { Observable, of } from 'rxjs';
import { VocabularyEntry, WordStats } from '../models/word-entry.model';
import {
  CollectionReference,
  DocumentReference,
  DocumentSnapshot,
  Firestore,
  query,
  where,
  Timestamp,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { InstructorFeedback } from '../models/instructor-feedback.model';
import { ReviewService } from './review.service';

@Injectable({
  providedIn: 'root',
})
export class WordService {
  public selectedWordSignal: WritableSignal<VocabularyEntry | undefined> =
    signal<VocabularyEntry | undefined>(undefined);
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private ppAuthLibService: PpAuthLibService,
    private reviewService: ReviewService
  ) {
    effect(async () => {
      const currentListOfWords = this.reviewService.listOfWordsSignal();
      console.log(
        `first index in current list of words: `,
        currentListOfWords[0]
      );
      if (currentListOfWords.length > 0) {
        const vocabularyEntry = await this.getVocabularyEntryByWord(
          currentListOfWords[0]
        );
        console.log(`vocabulary entry: `, vocabularyEntry);
        this.selectedWordSignal.set(vocabularyEntry);
      }
    });
  }
  public async getVocabularyEntryByWord(
    word: string
  ): Promise<VocabularyEntry> {
    const vocabulariesCollection = collection(this.firestore, `vocabularies`);
    const vocabularyQuery = query(
      vocabulariesCollection,
      where('word', '==', word)
    );
    return new Promise((resolve, reject) => {
      onSnapshot(vocabularyQuery, (snapshot) => {
        resolve(snapshot.docs[0].data() as VocabularyEntry);
      });
    });
  }
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
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const newWordEntry: WordStats = {
          word,
          lastPracticed: Timestamp.now(),
          nextPractice: Timestamp.fromDate(today),
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
        if (wordEntryData.masteryLevel < 5) {
          wordEntryData.masteryLevel += 1;
        }
        wordEntryData.currentInterval = wordEntryData.currentInterval * 2;
      }
      if (wordEntryData.currentInterval >= 180) {
        wordEntryData.currentInterval = 180;
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
