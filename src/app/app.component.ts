import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Firestore, collection, onSnapshot } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'wordsmith';
  constructor(private firestore: Firestore) {}

  public ngOnInit(): void {
    const testCollection = collection(this.firestore, 'test');
    onSnapshot(testCollection, (snapshot) => {
      snapshot.docs.forEach((element) => {
        console.log('data: ', element.data());
      });
    });
  }
}
