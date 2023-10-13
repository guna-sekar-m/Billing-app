import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInvoiceComponent } from './edit-invoice.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EditInvoiceComponent', () => {
  let component: EditInvoiceComponent;
  let fixture: ComponentFixture<EditInvoiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditInvoiceComponent],
      imports: [ HttpClientTestingModule ],
    });
    fixture = TestBed.createComponent(EditInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
