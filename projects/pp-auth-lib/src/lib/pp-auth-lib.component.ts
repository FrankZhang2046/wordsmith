import { MatButtonModule } from '@angular/material/button';
import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { Subscription, take, timer } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';
import { PpAuthLibService } from './pp-auth-lib.service';
import { SignUpComponent } from './sign-up/sign-up.component';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { SignInComponent } from './sign-in/sign-in.component';
import { Auth } from '@angular/fire/auth';

interface urlData {
  redirectUrl: string;
}
@Component({
  selector: 'lib-pp-auth-lib',
  standalone: true,
  templateUrl: './pp-auth-lib.component.html',
  styles: ``,
  imports: [
    CommonModule,
    MatTabsModule,
    SignUpComponent,
    SignInComponent,
    MatButtonModule,
  ],
})
export class PpAuthLibComponent implements OnInit {
  private auth = inject(Auth);
  private route = inject(ActivatedRoute);
  constructor(
    private router: Router,
    private authService: PpAuthLibService,
    private iconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.route.data.subscribe((data: Data) => {
      const destination = (data as urlData).redirectUrl;

      this.redirectIfAuthenticated(destination);
      this.auth.onAuthStateChanged((user) => {
        if (user) {
          console.log(`already authenticated, redirecting`);

          this.router.navigate([`/${destination}`]);
        }
      });
    });

    this.iconRegistry.addSvgIconLiteral(
      'google-icon',
      this.domSanitizer.bypassSecurityTrustHtml(
        `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 12C6 15.3137 8.68629 18 12 18C14.6124 18 16.8349 16.3304 17.6586 14H12V10H21.8047V14H21.8C20.8734 18.5645 16.8379 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C15.445 2 18.4831 3.742 20.2815 6.39318L17.0039 8.68815C15.9296 7.06812 14.0895 6 12 6C8.68629 6 6 8.68629 6 12Z" fill="currentColor" /></svg>

`
      )
    );
  }
  public authMessageClearTimeout!: Subscription;
  public isProd!: boolean;
  public remainingTime!: number;
  public authMessage: { status: string; message: any } = {
    status: '',
    message: null,
  };
  public async redirectIfAuthenticated(destination: string): Promise<void> {
    await this.auth.authStateReady();
    if (this.auth.currentUser) {
      console.log(`redirecting to dashboard`);
      this.router.navigate([`/${destination}`]);
    }
  }
  public ngOnInit(): void {
    this.isProd = this.authService.isProd;
  }
  /*
    handle the sign in status event from the sign in component
   */
  public handleAuthStatusEvent($event: any) {
    if (this.authMessageClearTimeout) {
      this.authMessageClearTimeout.unsubscribe();
    }
    this.authMessage = $event;
    this.clearAuthMessage();
  }
  /*
  use the timer rx operator to clear the auth message after a few seconds
   */
  public clearAuthMessage() {
    this.authMessageClearTimeout = timer(0, 1000)
      .pipe(take(6))
      .subscribe((val: number) => {
        if (this.authMessage.status === 'success') {
          this.remainingTime = 5 - val;
          if (this.remainingTime === 0) {
            this.authMessage = { status: '', message: null };
            this.navigateMethod();
          }
        } else if (this.authMessage.status === 'error') {
          this.remainingTime = 5 - val;
          if (this.remainingTime === 0) {
            this.authMessage = { status: '', message: null };
          }
        }
      });
  }

  public navigateMethod() {
    this.router.navigate(['/']);
  }
}
