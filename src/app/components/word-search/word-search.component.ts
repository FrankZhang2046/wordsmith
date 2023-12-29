import { WordSearchService } from './../../services/word-search.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, debounce, debounceTime, tap } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-word-search',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
  ],
  templateUrl: './word-search.component.html',
  styleUrl: './word-search.component.scss',
})
export class WordSearchComponent {
  public inputValue: FormControl<string | null> = new FormControl('');
  public filteredOptions: Observable<string[]> | undefined;
  constructor(private wordSearchService: WordSearchService) {
    this.inputValue.valueChanges
      .pipe(
        // debounce for 300 ms
        debounceTime(300)
      )
      .subscribe((value) => {
        if (value) {
          this.filteredOptions = this.wordSearchService.printWord(value);
          this.filteredOptions.pipe(tap(console.log)).subscribe();
        } else if (value === '') {
          this.filteredOptions = undefined;
        }
      });
  }
}
