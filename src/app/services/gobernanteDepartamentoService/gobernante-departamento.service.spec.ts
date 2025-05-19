import { TestBed } from '@angular/core/testing';

import { GobernanteDepartamentoService } from './gobernante-departamento.service';

describe('GobernanteDepartamentoServiceService', () => {
  let service: GobernanteDepartamentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GobernanteDepartamentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
