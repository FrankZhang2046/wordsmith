import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Firestore, collection, onSnapshot } from '@angular/fire/firestore';
import { PpAuthLibComponent } from 'pp-auth-lib';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, PpAuthLibComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'wordsmith';
  constructor(private firestore: Firestore) {}

  public ngOnInit(): void {}
}
