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
    return true;
  } else {
    return router.createUrlTree(['/log-in']);
  }
};
