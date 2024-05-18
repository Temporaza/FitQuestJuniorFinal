import { TestBed } from '@angular/core/testing';

import { AuthenticationForParentsService } from './authentication-for-parents.service';

describe('AuthenticationForParentsService', () => {
  let service: AuthenticationForParentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthenticationForParentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
