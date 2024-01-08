import { WordService } from '../../services/word.service';
import {
  Component,
  Input,
  OnInit,
  WritableSignal,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { VocabularyEntry } from '../../models/word-entry.model';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { UtilitiesService } from '../../services/utilities.service';
import { DocumentSnapshot } from '@angular/fire/firestore';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-view-word',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDividerModule],
  templateUrl: './view-word.component.html',
  styleUrl: './view-word.component.scss',
})
export class ViewWordComponent implements OnInit {
  public selectedWord: Observable<VocabularyEntry | undefined> =
    this.wordService.selectedWordSubject$.asObservable();
  public urlSegment: WritableSignal<string> = signal('');
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private wordService: WordService,
    private utilities: UtilitiesService,
    private reviewService: ReviewService
  ) {
    this.route.url.subscribe((url) => {
      this.urlSegment.set(url[0].path as string);
    });
  }
  public ngOnInit(): void {
    console.log(`calling the method in the service`);
  }
  public addToWordBank() {
    this.selectedWord.subscribe(async (word) => {
      if (word) {
        const currentUser: string | DocumentSnapshot =
          await this.wordService.addWordToWordBank(word?.word);
        if (typeof currentUser == 'string') {
          console.log(currentUser);
        } else {
          console.log('word entry doc: ', currentUser.data());
        }
      }
    });
    this.utilities.navigateMethod('sentence-construction');
  }
}
