import { TestBed } from '@angular/core/testing';

import { PointsServiceService } from './points.service.service';

describe('PointsServiceService', () => {
  let service: PointsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PointsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
