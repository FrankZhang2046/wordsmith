import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-bulk-ingestion',
  standalone: true,
  imports: [CommonModule, MatInputModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './bulk-ingestion.component.html',
  styleUrl: './bulk-ingestion.component.scss',
})
export class BulkIngestionComponent {
  public bulkWordString = new FormControl<string>('');
  public printForm() {
    console.log(this.returnListOfWords(this.bulkWordString.value || ''));
  }

  public returnListOfWords(str: string): string[] {
    return str
      .split('\n')
      .map((line) => line.replace(/[^a-zA-Z]/g, '').toLowerCase());
  }
}
