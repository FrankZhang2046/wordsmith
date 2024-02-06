import {
  Component,
  Input,
  Output,
  inject,
  EventEmitter,
  effect,
  computed,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SentenceService } from '../../services/sentence.service';
import { MatIconModule } from '@angular/material/icon';
import { ResolveFbBgColorPipeTsPipe } from '../../pipes/resolve-fb-bg-color.pipe.ts.pipe';
import { MatButtonModule } from '@angular/material/button';
import { ReviewService } from '../../services/review.service';
import { WordStats } from '../../models/word-entry.model';

@Component({
  selector: 'app-feedback-display',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    ResolveFbBgColorPipeTsPipe,
    MatButtonModule,
  ],
  templateUrl: './feedback-display.component.html',
  styleUrl: './feedback-display.component.scss',
})
export class FeedbackDisplayComponent {
  private reviewService = inject(ReviewService);
  public listOfWordsSignal = this.reviewService.listOfWordsSignal;
  public reviewQueueStats = computed(() => {
    const stats = { old: 0, new: 0 };
    this.listOfWordsSignal().map((wordStats: WordStats) => {
      if (
        wordStats.masteryLevel === 0 &&
        wordStats.sentenceHistory.length === 0
      ) {
        stats.new++;
      } else {
        stats.old++;
      }
    });
    return stats;
  });
  @Input() userSentence: string = '';
  @Output() confirmRetry: EventEmitter<boolean> = new EventEmitter();
  @Output() confirmNewAttempt: EventEmitter<'old' | 'new'> = new EventEmitter();
  public instructorFeedback = this.sentenceService.instructorFeedbackSignal;
  constructor(private sentenceService: SentenceService) {}
}
