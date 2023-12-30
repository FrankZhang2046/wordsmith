import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordEntry } from '../../model/word-entry.model';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-word',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDividerModule],
  templateUrl: './view-word.component.html',
  styleUrl: './view-word.component.scss',
})
export class ViewWordComponent {
  @Input() selectedWord: WordEntry | undefined;
  constructor(private router: Router) {}
  public navigateMethod() {
    // navigate to "sentence-construction"
    this.router.navigate(['/sentence-construction']);
  }
}
