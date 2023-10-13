import { TestBed } from '@angular/core/testing';

import { ApisettingsService } from './apisettings.service';

describe('ApisettingsService', () => {
  let service: ApisettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApisettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
