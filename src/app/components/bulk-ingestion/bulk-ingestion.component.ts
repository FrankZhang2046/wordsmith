import { MatChipsModule } from '@angular/material/chips';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-bulk-ingestion',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
  ],
  templateUrl: './bulk-ingestion.component.html',
  styleUrl: './bulk-ingestion.component.scss',
})
export class BulkIngestionComponent {
  public bulkWordString = new FormControl<string>('');
  public listOfWords: string[] = [];
  public printForm(event: Event) {
    event.preventDefault();
    this.listOfWords = this.returnListOfWords(this.bulkWordString.value || '');
  }

  public returnListOfWords(str: string): string[] {
    const wordList: string[] = [];
    str.split('\n').forEach((line) => {
      line
        .replace(/[^a-zA-Z]/g, '')
        .toLowerCase()
        .split(' ')
        .forEach((word) => {
          wordList.push(word);
        });
    });
    return wordList;
  }
}
