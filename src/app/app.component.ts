import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {
  Firestore,
  collection,
  doc,
  onSnapshot,
} from '@angular/fire/firestore';
import { PpAuthLibComponent } from 'pp-auth-lib';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { Auth, User, onAuthStateChanged } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { AuthActions } from './stores/actions/auth.action';
import { ReduxStateModel } from './model/redux-state.model';
import { WordSearchComponent } from './components/word-search/word-search.component';
import { WordSearchService } from './services/word-search.service';
import { log } from 'console';

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
    private wordSearchService: WordSearchService
  ) {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserVal = user;
      this.store.dispatch(new AuthActions.RegisterCurrentUser(user));
      // todo clean up this code, redirection should not be handled here
      if (user) {
        console.log('user', user);
      } else if (user === null) {
        console.log(`user is null`);
      }
    });
  }

  public ngOnInit(): void {}
}
