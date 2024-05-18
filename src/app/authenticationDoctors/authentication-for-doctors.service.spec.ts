import { TestBed } from '@angular/core/testing';

import { AuthenticationForDoctorsService } from './authentication-for-doctors.service';

describe('AuthenticationForDoctorsService', () => {
  let service: AuthenticationForDoctorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthenticationForDoctorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
