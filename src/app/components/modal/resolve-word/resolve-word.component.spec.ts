import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolveWordComponent } from './resolve-word.component';

describe('ResolveWordComponent', () => {
  let component: ResolveWordComponent;
  let fixture: ComponentFixture<ResolveWordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResolveWordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResolveWordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
