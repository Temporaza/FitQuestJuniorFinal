import { TestBed } from '@angular/core/testing';

import { AuthHomeParentGuard } from './auth-home-parent.guard';

describe('AuthHomeParentGuard', () => {
  let guard: AuthHomeParentGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthHomeParentGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
