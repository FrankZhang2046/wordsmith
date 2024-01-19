import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SentenceService } from '../../services/sentence.service';
import { MatIconModule } from '@angular/material/icon';
import { ResolveFbBgColorPipeTsPipe } from '../../pipes/resolve-fb-bg-color.pipe.ts.pipe';
import { MatButtonModule } from '@angular/material/button';

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
  @Input() userSentence: string = '';
  public instructorFeedback = this.sentenceService.instructorFeedbackSignal;
  constructor(private sentenceService: SentenceService) {}
}
