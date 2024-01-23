import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-word-detail',
  standalone: true,
  imports: [],
  templateUrl: './word-detail.component.html',
  styleUrl: './word-detail.component.scss',
})
export class WordDetailComponent {
  public word: string = '';
  constructor(private route: ActivatedRoute) {
    this.word = this.route.snapshot.paramMap.get('word') || '';
  }
}
