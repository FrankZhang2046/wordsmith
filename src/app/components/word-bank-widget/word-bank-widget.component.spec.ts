import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordBankWidgetComponent } from './word-bank-widget.component';

describe('WordBankWidgetComponent', () => {
  let component: WordBankWidgetComponent;
  let fixture: ComponentFixture<WordBankWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordBankWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WordBankWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
