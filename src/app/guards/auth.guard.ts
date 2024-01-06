import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { inject } from '@angular/core';
import { WordService } from '../services/word.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const auth = inject(Auth);
  const wordService = inject(WordService);
  const router = inject(Router);
  await auth.authStateReady();
  if (auth.currentUser) {
    if (wordService.selectedWordSubject.value) {
      return true;
    } else {
      console.log(`need to select a word`);
      return router.createUrlTree(['/word-search']);
    }
  } else {
    return router.createUrlTree(['/log-in']);
  }
};
