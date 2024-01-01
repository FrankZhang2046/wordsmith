import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthToggleButtonComponent } from './auth-toggle-button.component';

describe('AuthToggleButtonComponent', () => {
  let component: AuthToggleButtonComponent;
  let fixture: ComponentFixture<AuthToggleButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthToggleButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuthToggleButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
