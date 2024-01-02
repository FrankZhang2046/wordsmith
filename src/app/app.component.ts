import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import {
  Firestore,
  collection,
  doc,
  onSnapshot,
} from '@angular/fire/firestore';
import { PpAuthLibComponent, PpAuthLibService } from 'pp-auth-lib';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { Auth, User, onAuthStateChanged } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { AuthActions } from './stores/actions/auth.action';
import { ReduxStateModel } from './models/redux-state.model';
import { WordSearchComponent } from './components/word-search/word-search.component';
import { WordService } from './services/word.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { AuthToggleButtonComponent } from './components/auth-toggle-button/auth-toggle-button.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    CommonModule,
    RouterOutlet,
    PpAuthLibComponent,
    MatToolbarModule,
    WordSearchComponent,
    MatIconModule,
    MatTooltipModule,
    AuthToggleButtonComponent,
  ],
})
export class AppComponent implements OnInit {
  public currentUser$!: Observable<User | null>;
  public currentUserVal!: User | null;
  title = 'wordsmith';
  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private store: Store,
    private wordSearchService: WordService,
    private router: Router,
    private ppAuthLibService: PpAuthLibService
  ) {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserVal = user;
      this.ppAuthLibService.authenticatedUser$.next(user);
      // this.store.dispatch(new AuthActions.RegisterCurrentUser(user));
      // // todo clean up this code, redirection should not be handled here
      // if (user) {
      //   console.log('user', user);
      // } else if (user === null) {
      //   console.log(`user is null`);
      // }
    });
  }

  public ngOnInit(): void {}
  public redirectMethod(destination: string): void {
    this.router.navigate([`/${destination}`]);
  }
}
