import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription, take, timer } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'lib-pp-auth-lib',
  standalone: true,
  imports: [CommonModule, MatTabsModule],
  templateUrl: './pp-auth-lib.component.html',
  styles: ``,
})
export class PpAuthLibComponent {
  constructor(private router: Router) {}
  public authMessageClearTimeout!: Subscription;
  public remainingTime!: number;
  public authMessage: { status: string; message: any } = {
    status: '',
    message: null,
  };
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
