import { TestBed } from '@angular/core/testing';

import { ApiregisterService } from './apiregister.service';

describe('ApiregisterService', () => {
  let service: ApiregisterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiregisterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
