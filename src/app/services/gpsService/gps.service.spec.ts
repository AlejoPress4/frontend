import { TestBed } from '@angular/core/testing';

import { GPSService } from './gps.service';

describe('GPSService', () => {
  let service: GPSService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GPSService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
