import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentenceConstructionComponent } from './sentence-construction.component';

describe('SentenceConstructionComponent', () => {
  let component: SentenceConstructionComponent;
  let fixture: ComponentFixture<SentenceConstructionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SentenceConstructionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SentenceConstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
