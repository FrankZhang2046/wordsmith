import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartViewWidgetComponent } from './chart-view-widget.component';

describe('ChartViewWidgetComponent', () => {
  let component: ChartViewWidgetComponent;
  let fixture: ComponentFixture<ChartViewWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartViewWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChartViewWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
