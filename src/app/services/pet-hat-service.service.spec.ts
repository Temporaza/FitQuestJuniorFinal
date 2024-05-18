import { TestBed } from '@angular/core/testing';

import { PetHatServiceService } from './pet-hat-service.service';

describe('PetHatServiceService', () => {
  let service: PetHatServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PetHatServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
