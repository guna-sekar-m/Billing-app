import { TestBed } from '@angular/core/testing';

import { APIitemsService } from './apiitems.service';

describe('APIitemsService', () => {
  let service: APIitemsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(APIitemsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
