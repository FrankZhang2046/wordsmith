import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkIngestionComponent } from './bulk-ingestion.component';

describe('BulkIngestionComponent', () => {
  let component: BulkIngestionComponent;
  let fixture: ComponentFixture<BulkIngestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkIngestionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BulkIngestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
