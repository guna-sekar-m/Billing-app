import { TestBed } from '@angular/core/testing';

import { ApilicenseService } from './apilicense.service';

describe('ApilicenseService', () => {
  let service: ApilicenseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApilicenseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
