import { TestBed } from '@angular/core/testing';

import { ApiloginService } from './apilogin.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
describe('ApiloginService', () => {
  let service: ApiloginService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
    });
    service = TestBed.inject(ApiloginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
