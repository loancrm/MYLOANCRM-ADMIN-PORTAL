import { TestBed } from '@angular/core/testing';

import { BsanalyzerService } from './bsanalyzer.service';

describe('BsanalyzerService', () => {
  let service: BsanalyzerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BsanalyzerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
