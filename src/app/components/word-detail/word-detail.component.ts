import { Component, Input, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViewWordComponent } from '../view-word/view-word.component';
import { WordService } from '../../services/word.service';
import { WordStats } from '../../models/word-entry.model';
import { Timestamp } from '@angular/fire/firestore';

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
  public selectedWordStatsSignal = this.wordService.selectedWordStatsSignal;

  constructor(private route: ActivatedRoute) {
    this.word = this.route.snapshot.paramMap.get('word') || '';
    this.wordService.setSelectedWordByWord(this.word);
  }

  public dateTimeFormatter(date: Timestamp): string {
    return date.toDate().toISOString().split('T')[0];
  }
}
