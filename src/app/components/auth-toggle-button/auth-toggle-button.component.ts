import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PpAuthLibService } from 'pp-auth-lib';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-auth-toggle-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth-toggle-button.component.html',
  styleUrl: './auth-toggle-button.component.scss',
})
export class AuthToggleButtonComponent {
  public authenticatedUser: User | null = null;
  constructor(private ppAuthLibService: PpAuthLibService) {
    this.ppAuthLibService.authenticatedUser$.subscribe(
      (user) => (this.authenticatedUser = user)
    );
  }
}
