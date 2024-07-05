import { TestBed } from '@angular/core/testing';

import { RifaGuard } from './rifa.guard';

describe('RifaGuard', () => {
  let guard: RifaGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RifaGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
