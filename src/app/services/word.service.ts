import { Injectable, WritableSignal, signal } from '@angular/core';
import Fuse from 'fuse.js';
import { listOfWords } from '../data/listOfWords';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { log } from 'console';
import { VocabularyEntry } from '../models/word-entry.model';

@Injectable({
  providedIn: 'root',
})
export class WordService {
  public selectedWordSubject: BehaviorSubject<VocabularyEntry | undefined> =
    new BehaviorSubject<VocabularyEntry | undefined>(undefined);
  constructor() {}
  public fuzzySearchWord(letters: string): Observable<string[]> {
    const fuse = new Fuse(listOfWords, { includeScore: true });
    const searchResult = fuse
      .search(letters)
      .slice(0, 11)
      .map((word) => word.item);
    return of(searchResult);
  }
}
