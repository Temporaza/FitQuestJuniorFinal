import { TestBed } from '@angular/core/testing';

import { ActivityLogServiceService } from './activity-log-service.service';

describe('ActivityLogServiceService', () => {
  let service: ActivityLogServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivityLogServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
