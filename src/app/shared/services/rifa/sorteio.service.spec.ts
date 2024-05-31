import { TestBed } from '@angular/core/testing';

import { RifaSorteioService } from './rifa-sorteio.service';

describe('SorteioService', () => {
  let service: RifaSorteioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RifaSorteioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
