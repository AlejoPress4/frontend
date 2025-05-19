import { TestBed } from '@angular/core/testing';

import { GobernanteService } from './gobernante.service';

describe('GobernanteService', () => {
  let service: GobernanteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GobernanteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
