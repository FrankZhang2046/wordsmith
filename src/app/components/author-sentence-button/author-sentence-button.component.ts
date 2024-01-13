import { SentenceService } from './../../services/sentence.service';
import { ReviewService } from './../../services/review.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { PpAuthLibService } from 'pp-auth-lib';
import { UtilitiesService } from '../../services/utilities.service';

@Component({
  selector: 'app-author-sentence-button',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './author-sentence-button.component.html',
  styleUrl: './author-sentence-button.component.scss',
})
export class AuthorSentenceButtonComponent {
  constructor(
    private ppAuthLibService: PpAuthLibService,
    private utilities: UtilitiesService,
    private reviewService: ReviewService,
    private sentenceService: SentenceService
  ) {}
  public async authorSentenceIconClickEventHandler() {
    if (this.sentenceService.instructorFeedback()) {
      this.sentenceService.instructorFeedback.set(undefined);
    }
    this.reviewService.getReviewQueue();
    const currentUser = await this.ppAuthLibService.getCurrentUser();
    if (currentUser) {
      this.utilities.navigateMethod('sentence-construction');
    } else {
      console.log(`please log in first.`);
    }
  }
}
