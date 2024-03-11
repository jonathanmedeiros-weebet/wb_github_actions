import { TestBed } from '@angular/core/testing';

import { RifaBilheteService } from './rifa-bilhete.service';

describe('RifaBilheteService', () => {
  let service: RifaBilheteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RifaBilheteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
