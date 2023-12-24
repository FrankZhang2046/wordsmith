import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription, take, timer } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';
import { PpAuthLibService } from './pp-auth-lib.service';
import { SignUpComponent } from './sign-up/sign-up.component';

@Component({
  selector: 'lib-pp-auth-lib',
  standalone: true,
  templateUrl: './pp-auth-lib.component.html',
  styles: ``,
  imports: [CommonModule, MatTabsModule, SignUpComponent],
})
export class PpAuthLibComponent implements OnInit {
  constructor(private router: Router, private authService: PpAuthLibService) {}
  public authMessageClearTimeout!: Subscription;
  public isProd!: boolean;
  public remainingTime!: number;
  public authMessage: { status: string; message: any } = {
    status: '',
    message: null,
  };
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