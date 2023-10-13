import { TestBed } from '@angular/core/testing';

import { APIEndpointService } from './apiendpoint.service';

describe('APIEndpointService', () => {
  let service: APIEndpointService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(APIEndpointService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
