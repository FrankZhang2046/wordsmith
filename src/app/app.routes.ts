import { Routes } from '@angular/router';
import { PpAuthLibComponent } from 'pp-auth-lib';
import { SentenceConstructionComponent } from './components/sentence-construction/sentence-construction.component';

export const routes: Routes = [
  {
    path: 'log-in',
    component: PpAuthLibComponent,
  },
  {
    path: 'sentence-construction',
    component: SentenceConstructionComponent,
  },
];
