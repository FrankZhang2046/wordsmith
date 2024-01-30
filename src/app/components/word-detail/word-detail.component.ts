import { Component, Input, inject, Pipe } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViewWordComponent } from '../view-word/view-word.component';
import { WordService } from '../../services/word.service';
import { WordStats } from '../../models/word-entry.model';
import { Timestamp } from '@angular/fire/firestore';
import { UtilitiesService } from '../../services/utilities.service';
import { MatButtonModule } from '@angular/material/button';
import { ResolveChipBgColorPipe } from '../../pipes/resolve-chip-bg-color.pipe';

@Component({
  selector: 'app-word-detail',
  standalone: true,
  templateUrl: './word-detail.component.html',
  styleUrl: './word-detail.component.scss',
  imports: [ViewWordComponent, MatButtonModule, ResolveChipBgColorPipe],
})
export class WordDetailComponent {
  public word: string = '';
  private utilityService = inject(UtilitiesService);
  private wordService = inject(WordService);
  public selectedWordStatsSignal = this.wordService.selectedWordStatsSignal;

  constructor(private route: ActivatedRoute) {
    this.word = this.route.snapshot.paramMap.get('word') || '';
    this.wordService.setSelectedWordByWord(this.word);
  }

  public dateTimeFormatter(date: Timestamp): string {
    return date.toDate().toISOString().split('T')[0];
  }

  public backToDashboard(): void {
    this.utilityService.navigateMethod('dashboard');
  }
}
