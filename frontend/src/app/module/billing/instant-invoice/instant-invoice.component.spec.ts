import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstantInvoiceComponent } from './instant-invoice.component';

describe('InstantInvoiceComponent', () => {
  let component: InstantInvoiceComponent;
  let fixture: ComponentFixture<InstantInvoiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstantInvoiceComponent]
    });
    fixture = TestBed.createComponent(InstantInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
