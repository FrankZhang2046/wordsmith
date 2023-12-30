import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordEntry } from '../../model/word-entry.model';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-view-word',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDividerModule],
  templateUrl: './view-word.component.html',
  styleUrl: './view-word.component.scss',
})
export class ViewWordComponent {
  @Input() selectedWord: WordEntry | undefined;
}
