import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import {
  Messaging,
  getMessaging,
  getToken,
  onMessage,
} from '@angular/fire/messaging';
import { Firestore } from '@angular/fire/firestore';
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
  private ppAuthLibService = inject(PpAuthLibService);
  public currentUser$!: Observable<User | null>;
  public currentUserVal!: User | null;
  title = 'wordsmith';
  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private wordSearchService: WordService,
    private router: Router,
    private messaging: Messaging
  ) {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserVal = user;
      this.ppAuthLibService.authenticatedUserSignal.set(user);
    });
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
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      console.log(`foreground msg is: `, payload);
      this.displayNotification(payload);
    });
  }

  private displayNotification(message: any) {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        const notificationTitle = 'foreground msg';
        const notificationOptions = {
          body: message.notification.body,
        };

        new Notification(notificationTitle, notificationOptions);
      }
    });
  }
}
