import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorSentenceButtonComponent } from './author-sentence-button.component';

describe('AuthorSentenceButtonComponent', () => {
  let component: AuthorSentenceButtonComponent;
  let fixture: ComponentFixture<AuthorSentenceButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorSentenceButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuthorSentenceButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
