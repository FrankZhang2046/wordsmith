import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationStripComponent } from './notification-strip.component';

describe('NotificationStripComponent', () => {
  let component: NotificationStripComponent;
  let fixture: ComponentFixture<NotificationStripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationStripComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotificationStripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
