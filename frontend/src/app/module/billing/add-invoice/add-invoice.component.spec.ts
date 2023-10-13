import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInvoiceComponent } from './add-invoice.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AddInvoiceComponent', () => {
  let component: AddInvoiceComponent;
  let fixture: ComponentFixture<AddInvoiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddInvoiceComponent],
      imports: [ HttpClientTestingModule ],
    });
    fixture = TestBed.createComponent(AddInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
