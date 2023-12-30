import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ViewWordComponent } from '../view-word/view-word.component';

@Component({
  selector: 'app-sentence-construction',
  standalone: true,
  templateUrl: './sentence-construction.component.html',
  styleUrl: './sentence-construction.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    ViewWordComponent,
  ],
})
export class SentenceConstructionComponent {}
