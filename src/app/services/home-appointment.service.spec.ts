import { TestBed } from '@angular/core/testing';

import { HomeAppointmentService } from './home-appointment.service';

describe('HomeAppointmentService', () => {
  let service: HomeAppointmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeAppointmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
