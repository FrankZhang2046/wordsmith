import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViewWordComponent } from '../view-word/view-word.component';
import { WordService } from '../../services/word.service';

@Component({
  selector: 'app-word-detail',
  standalone: true,
  templateUrl: './word-detail.component.html',
  styleUrl: './word-detail.component.scss',
  imports: [ViewWordComponent],
})
export class WordDetailComponent {
  public word: string = '';
  private wordService = inject(WordService);
  constructor(private route: ActivatedRoute) {
    this.word = this.route.snapshot.paramMap.get('word') || '';
    this.wordService.setSelectedWordByWord(this.word);
  }
}
