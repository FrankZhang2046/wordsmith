import { Component } from '@angular/core';
import { WordSearchComponent } from '../word-search/word-search.component';

@Component({
  selector: 'app-main',
  standalone: true,
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  imports: [WordSearchComponent],
})
export class MainComponent {}
