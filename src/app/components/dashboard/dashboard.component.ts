import {
  Component,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import {
  Firestore,
  collection,
  getDocs,
  onSnapshot,
} from '@angular/fire/firestore';
import { VocabularyEntry, WordStats } from '../../models/word-entry.model';
import { Auth } from '@angular/fire/auth';
import { WordBankWidgetComponent } from '../word-bank-widget/word-bank-widget.component';
import { WordService } from '../../services/word.service';
import { ChartViewWidgetComponent } from '../chart-view-widget/chart-view-widget.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [WordBankWidgetComponent, ChartViewWidgetComponent],
})
export class DashboardComponent implements OnInit {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private wordService = inject(WordService);

  public async ngOnInit(): Promise<any> {
    await this.auth.authStateReady();
    const uid = this.auth.currentUser?.uid;
    console.log(`uid: `, uid);

    const wordsCollection = collection(this.firestore, `users/${uid}/words`);

    getDocs(wordsCollection).then((snapshot) => {
      const wordEntries = snapshot.docs.map((doc) => doc.data() as WordStats);
      this.wordService.wordBankEntriesSignal.set(wordEntries);
    });
  }
}