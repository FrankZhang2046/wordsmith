import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PpAuthLibService } from 'pp-auth-lib';
import { User } from '@angular/fire/auth';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-toggle-button',
  standalone: true,
  imports: [CommonModule, MatMenuModule],
  templateUrl: './auth-toggle-button.component.html',
  styleUrl: './auth-toggle-button.component.scss',
})
export class AuthToggleButtonComponent {
  private ppAuthLibService = inject(PpAuthLibService);
  public authenticatedUser = this.ppAuthLibService.authenticatedUserSignal;
  constructor(private router: Router) {}
  public signOutMethod(): void {
    this.ppAuthLibService.signOut();
  }

  public redirectMethod(target: string): void {
    this.router.navigate([`/${target}`]);
  }
}
