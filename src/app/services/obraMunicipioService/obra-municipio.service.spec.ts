import { TestBed } from '@angular/core/testing';

import { ObraMunicipioService } from './obra-municipio.service';

describe('ObraMunicipioService', () => {
  let service: ObraMunicipioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObraMunicipioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
