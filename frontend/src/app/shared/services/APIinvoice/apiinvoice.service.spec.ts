import { TestBed } from '@angular/core/testing';

import { APIinvoiceService } from './apiinvoice.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('APIinvoiceService', () => {
  let service: APIinvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [ HttpClientTestingModule ],});
    service = TestBed.inject(APIinvoiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
