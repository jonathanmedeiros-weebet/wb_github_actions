import { TestBed } from '@angular/core/testing';

import { DocCheckService } from './doc-check.service';

describe('DocCheckService', () => {
  let service: DocCheckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocCheckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
