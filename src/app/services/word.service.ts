import { Injectable, WritableSignal, signal } from '@angular/core';
import Fuse from 'fuse.js';
import { listOfWords } from '../data/listOfWords';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { log } from 'console';
import { VocabularyEntry, WordEntry } from '../models/word-entry.model';
import {
  DocumentData,
  DocumentReference,
  Firestore,
  Timestamp,
  collection,
  doc,
  getDoc,
  setDoc,
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class WordService {
  public selectedWordSubject: BehaviorSubject<VocabularyEntry | undefined> =
    new BehaviorSubject<VocabularyEntry | undefined>(undefined);
  constructor(private auth: Auth, private firestore: Firestore) {}
  public async addWordToWordBank(word: string): Promise<DocumentData | string> {
    // grab the correct collection for the user
    const user = await this.auth.currentUser;
    const wordBankCollection = collection(
      this.firestore,
      `users/${user?.uid}/words/`
    );
    // if the collection has a document with word as the key, return the document, if not, create it
    const wordEntryDocument = doc(wordBankCollection, word);
    return getDoc(wordEntryDocument).then((doc) => {
      if (doc.exists()) {
        return doc;
      } else {
        const newWordEntry: WordEntry = {
          word: {
            lastPracticed: Timestamp.now(),
            nextPractice: Timestamp.now(),
            masteryLevel: 1,
            sentenceHistory: [],
          },
        };
        setDoc(wordEntryDocument, newWordEntry);
        return 'doc created';
      }
    });
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
