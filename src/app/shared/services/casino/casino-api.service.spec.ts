import { TestBed } from '@angular/core/testing';

import { CasinoApiService } from './casino-api.service';

describe('CasinoApiService', () => {
  let service: CasinoApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CasinoApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
