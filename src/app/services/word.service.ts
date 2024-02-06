import { WordStats, VocabularyEntry } from './../models/word-entry.model';
import { PpAuthLibService } from 'pp-auth-lib';
import {
  Injectable,
  WritableSignal,
  effect,
  inject,
  signal,
} from '@angular/core';
import Fuse, { FuseResult } from 'fuse.js';
import { listOfWords } from '../data/listOfWords';
import { Observable, of } from 'rxjs';
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
  getDocs,
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { InstructorFeedback } from '../models/instructor-feedback.model';
import { ReviewService } from './review.service';

@Injectable({
  providedIn: 'root',
})
export class WordService {
  public wordBankEntriesSignal: WritableSignal<WordStats[]> = signal([]);
  public selectedWordStatsSignal: WritableSignal<WordStats | null> = signal(
    {} as WordStats
  );
  public selectedWordSignal: WritableSignal<VocabularyEntry | undefined> =
    signal<VocabularyEntry | undefined>(undefined);
  private ppAuthLibService = inject(PpAuthLibService);
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private reviewService: ReviewService
  ) {
    effect(async () => {
      if (
        this.reviewService.listOfWordsSignal().length > 0 &&
        this.selectedWordSignal() === undefined
      ) {
        const newList = this.reviewService.listOfWordsSignal();
        const wordEntry = await this.getVocabularyEntryByWord(newList[0].word);
        this.selectedWordSignal.set(wordEntry);
      }
    });

    effect(async () => {
      if (this.selectedWordSignal()?.word) {
        const wordStat = await this.getWordStats(
          this.selectedWordSignal()?.word!
        );
        console.log(`updated wordStat: `, wordStat);
        this.selectedWordStatsSignal.set(wordStat);
      }
    });

    // this.injectSampleWord();
  }

  public async setSelectedWordByWord(word: string): Promise<void> {
    const vocabularyEntry = await this.getVocabularyEntryByWord(word);
    this.selectedWordSignal.set(vocabularyEntry);
  }

  public isNewWord(wordStats: WordStats): boolean {
    return (
      wordStats.masteryLevel === 0 && wordStats.sentenceHistory.length === 0
    );
  }

  public async getNextWordFromReviewQueue(
    attribute: 'old' | 'new'
  ): Promise<void> {
    console.log(`user wants a ${attribute} word`);

    let targetWordStats;
    if (attribute === 'new') {
      targetWordStats = this.reviewService
        .listOfWordsSignal()
        .find((wordStats) => this.isNewWord(wordStats));
    } else {
      targetWordStats = this.reviewService
        .listOfWordsSignal()
        .find((wordStats) => !this.isNewWord(wordStats));
    }
    console.log(`targetwordstats: `, targetWordStats);
    const VocabularyEntry = await this.getVocabularyEntryByWord(
      targetWordStats?.word!
    );
    this.selectedWordSignal.set(VocabularyEntry);
  }

  public async getWordStats(word: string): Promise<WordStats> {
    const user = await this.ppAuthLibService.getCurrentUser();
    const wordDocumentRef = doc(
      this.firestore,
      `users/${user?.uid}/words/${word}`
    );
    const returnVal = await getDoc(wordDocumentRef);
    return returnVal.data() as WordStats;
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
      getDocs(vocabularyQuery).then((snapshot) => {
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
          dateAdded: Timestamp.fromDate(today),
          masteryLevel: 0,
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
      wordEntry.lastPracticed.toMillis() + intervalInDays * 24 * 60 * 60 * 1000;
    return Timestamp.fromMillis(nextPracticeTime);
  }

  public fuzzySearchWord(letters: string): Observable<FuseResult<string>[]> {
    const fuse = new Fuse(listOfWords, { includeScore: true });
    const searchResult = fuse.search(letters);
    return of(searchResult.slice(0, 11));
  }

  private injectSampleWord() {
    this.selectedWordSignal.set({
      word: 'anopheles',
      definition:
        'A genus of mosquitoes which are secondary hosts of the malaria parasites, and whose bite is the usual, if not the only, means of infecting human beings with malaria. Several species are found in the United States. They may be distinguished from the ordinary mosquitoes of the genus Culex by the long slender palpi, nearly equaling the beak in length, while those of the female Culex are very short. They also assume different positions when resting, Culex usually holding the body parallel to the surface on which it rests and keeping the head and beak bent at an angle, while Anopheles holds the body at an angle with the surface and the head and beak in line with it. Unless they become themselves infected by previously biting a subject affected with malaria, the insects cannot transmit the disease.',
    } as VocabularyEntry);
  }
}
