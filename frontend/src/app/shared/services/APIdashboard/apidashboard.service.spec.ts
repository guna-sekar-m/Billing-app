import { TestBed } from '@angular/core/testing';

import { APIdashboardService } from './apidashboard.service';

describe('APIdashboardService', () => {
  let service: APIdashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(APIdashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
