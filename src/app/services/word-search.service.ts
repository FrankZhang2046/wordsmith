import { Injectable, WritableSignal, signal } from '@angular/core';
import Fuse from 'fuse.js';
import { listOfWords } from '../data/listOfWords';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { log } from 'console';
import { WordEntry } from '../model/word-entry.model';

@Injectable({
  providedIn: 'root',
})
export class WordSearchService {
  public selectedWordSubject: BehaviorSubject<WordEntry | undefined> =
    new BehaviorSubject<WordEntry | undefined>(undefined);
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
