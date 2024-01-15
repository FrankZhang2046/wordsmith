import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import {
  Messaging,
  getMessaging,
  getToken,
  onMessage,
} from '@angular/fire/messaging';
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
import { WordSearchComponent } from './components/word-search/word-search.component';
import { WordService } from './services/word.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { AuthToggleButtonComponent } from './components/auth-toggle-button/auth-toggle-button.component';
import { ReviewService } from './services/review.service';
import { AuthorSentenceButtonComponent } from './components/author-sentence-button/author-sentence-button.component';
import { NotificationStripComponent } from './components/notification-strip/notification-strip.component';

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
    AuthorSentenceButtonComponent,
    NotificationStripComponent,
  ],
})
export class AppComponent implements OnInit {
  public currentUser$!: Observable<User | null>;
  public currentUserVal!: User | null;
  title = 'wordsmith';
  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private wordSearchService: WordService,
    private router: Router,
    private ppAuthLibService: PpAuthLibService,
    private messaging: Messaging
  ) {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserVal = user;
      this.ppAuthLibService.authenticatedUserSignal.set(user);
    });

    setTimeout(() => {
      this.startReceivingMessages();
    }, 5000);
  }

  public ngOnInit(): void {
    setTimeout(() => {
      this.requestPermission();
    }, 5000);
  }
  public redirectMethod(destination: string): void {
    this.router.navigate([`/${destination}`]);
  }

  public requestPermission() {
    const messaging = getMessaging();
    getToken(messaging, {
      vapidKey:
        'BP8rcV6a8WQJ3ecIwSko9s--Mpx1rUPKnEG4PtvZkThMXp9aaRNxmSgw04IyoV1Q7pBuhmOoVTxHQIzatFMQo1c',
    })
      .then((currentToken) => {
        if (currentToken) {
          // send token to server
          console.log(`current token: `, currentToken);
        } else {
          console.log(
            `no registration token available. Request permission to generate one.`
          );
        }
      })
      .catch((err) =>
        console.log(`an error occurred while retrieving token.`, err)
      );
  }

  public startReceivingMessages() {
    console.log(`will console log out incoming messages`);
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      console.log(`message is: `, payload);
    });
  }
}
