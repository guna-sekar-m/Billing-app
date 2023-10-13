import { TestBed } from '@angular/core/testing';

import { ApiforgotPasswordService } from './apiforgot-password.service';

describe('ApiforgotPasswordService', () => {
  let service: ApiforgotPasswordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiforgotPasswordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
