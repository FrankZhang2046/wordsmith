import { ReviewService } from './../../services/review.service';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PpAuthLibService } from 'pp-auth-lib';
import { User } from '@angular/fire/auth';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { WordService } from '../../services/word.service';
import { SentenceService } from '../../services/sentence.service';

@Component({
  selector: 'app-auth-toggle-button',
  standalone: true,
  imports: [CommonModule, MatMenuModule],
  templateUrl: './auth-toggle-button.component.html',
  styleUrl: './auth-toggle-button.component.scss',
})
export class AuthToggleButtonComponent {
  private ppAuthLibService = inject(PpAuthLibService);
  private wordService = inject(WordService);
  private sentenceService = inject(SentenceService);
  private reviewService = inject(ReviewService);
  public authenticatedUser = this.ppAuthLibService.authenticatedUserSignal;
  constructor(private router: Router) {}
  public signOutMethod(): void {
    this.wordService.flushAllSignals();
    this.sentenceService.flushInstructorFeedbackSignal();
    this.reviewService.flushListOfWordsSignal();
    this.ppAuthLibService.signOut();
  }

  public redirectMethod(target: string): void {
    this.router.navigate([`/${target}`]);
  }
}
