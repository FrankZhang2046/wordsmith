import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SentenceService } from '../../services/sentence.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-feedback-display',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './feedback-display.component.html',
  styleUrl: './feedback-display.component.scss',
})
export class FeedbackDisplayComponent {
  public instructorFeedback = this.sentenceService.instructorFeedbackSignal;
  constructor(private sentenceService: SentenceService) {}
}
