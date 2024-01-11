import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WordImportStatus } from '../../../models/word-entry.model';

@Component({
  selector: 'app-resolve-word',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resolve-word.component.html',
  styleUrl: './resolve-word.component.scss',
})
export class ResolveWordComponent {
  constructor() {
    const matDialogData = inject(MAT_DIALOG_DATA);
    console.log(`data: `, matDialogData);
  }
}
