import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PpAuthLibComponent } from './pp-auth-lib.component';

describe('PpAuthLibComponent', () => {
  let component: PpAuthLibComponent;
  let fixture: ComponentFixture<PpAuthLibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PpAuthLibComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PpAuthLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
