import { TestBed } from '@angular/core/testing';

import { DdmtLibService } from './ddmt-lib.service';

describe('DdmtLibService', () => {
  let service: DdmtLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DdmtLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
