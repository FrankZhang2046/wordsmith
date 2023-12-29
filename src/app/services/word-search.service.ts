import { Injectable } from '@angular/core';
import Fuse from 'fuse.js';
import { listOfWords } from '../data/listOfWords';

@Injectable({
  providedIn: 'root',
})
export class WordSearchService {
  constructor() {}
  public printWord(letters: string): void {
    const fuse = new Fuse(listOfWords, { includeScore: true });
    console.log(fuse.search(letters).slice(0, 11));
    return;
  }
}
