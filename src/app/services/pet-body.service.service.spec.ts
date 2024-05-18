import { TestBed } from '@angular/core/testing';

import { PetBodyServiceService } from './pet-body.service.service';

describe('PetBodyServiceService', () => {
  let service: PetBodyServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PetBodyServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
