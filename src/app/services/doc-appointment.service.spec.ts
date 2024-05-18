import { TestBed } from '@angular/core/testing';

import { DocAppointmentService } from './doc-appointment.service';

describe('DocAppointmentService', () => {
  let service: DocAppointmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocAppointmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
