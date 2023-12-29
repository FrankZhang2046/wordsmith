import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordEntry } from '../../model/word-entry.model';

@Component({
  selector: 'app-view-word',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-word.component.html',
  styleUrl: './view-word.component.scss',
})
export class ViewWordComponent {
  @Input() selectedWord: WordEntry | undefined;
}
