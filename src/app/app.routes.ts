import { DashboardComponent } from './components/dashboard/dashboard.component';
import { Routes } from '@angular/router';
import { PpAuthLibComponent } from 'pp-auth-lib';
import { SentenceConstructionComponent } from './components/sentence-construction/sentence-construction.component';
import { WordSearchComponent } from './components/word-search/word-search.component';
import { authGuard } from './guards/auth.guard';
import { BulkIngestionComponent } from './components/bulk-ingestion/bulk-ingestion.component';
import { WordDetailComponent } from './components/word-detail/word-detail.component';

export const routes: Routes = [
  {
    path: 'log-in',
    component: PpAuthLibComponent,
    data: {
      redirectUrl: 'dashboard',
    },
  },
  {
    path: 'sentence-construction',
    component: SentenceConstructionComponent,
    canActivate: [authGuard],
  },
  {
    path: 'word-search',
    component: WordSearchComponent,
  },
  {
    path: 'bulk-ingestion',
    component: BulkIngestionComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'word-detail/:word',
    component: WordDetailComponent,
    canActivate: [authGuard],
  },
];
