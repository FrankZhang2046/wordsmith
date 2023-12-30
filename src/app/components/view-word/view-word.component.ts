import { WordSearchService } from './../../services/word-search.service';
import { Component, Input, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordEntry } from '../../model/word-entry.model';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-view-word',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDividerModule],
  templateUrl: './view-word.component.html',
  styleUrl: './view-word.component.scss',
})
export class ViewWordComponent {
  public selectedWord: Observable<WordEntry | undefined> =
    this.wordSearchService.selectedWordSubject.asObservable();
  public urlSegment: WritableSignal<string> = signal('');
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private wordSearchService: WordSearchService
  ) {
    this.route.url.subscribe((url) => {
      this.urlSegment.set(url[0].path as string);
    });
  }
  public navigateMethod() {
    this.router.navigate(['/sentence-construction']);
  }
}
