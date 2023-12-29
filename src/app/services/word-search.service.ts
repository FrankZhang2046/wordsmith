import { Injectable } from '@angular/core';
import Fuse from 'fuse.js';
import { listOfWords } from '../data/listOfWords';
import { Observable, from, of } from 'rxjs';
import { log } from 'console';

@Injectable({
  providedIn: 'root',
})
export class WordSearchService {
  constructor() {}
  public printWord(letters: string): Observable<string[]> {
    const fuse = new Fuse(listOfWords, { includeScore: true });
    const searchResult = fuse
      .search(letters)
      .slice(0, 11)
      .map((word) => word.item);
    console.log(`results: `, searchResult);
    return of(searchResult);
  }
}
