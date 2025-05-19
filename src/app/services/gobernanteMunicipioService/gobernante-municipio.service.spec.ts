import { TestBed } from '@angular/core/testing';

import { GobernanteMunicipioService } from './gobernante-municipio.service';

describe('GobernanteMunicipioService', () => {
  let service: GobernanteMunicipioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GobernanteMunicipioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
