import { TestBed } from '@angular/core/testing';

import { RifaApostaService } from './rifa-aposta.service';

describe('RifaApostaService', () => {
  let service: RifaApostaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RifaApostaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
