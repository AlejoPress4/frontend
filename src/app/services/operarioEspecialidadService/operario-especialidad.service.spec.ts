import { TestBed } from '@angular/core/testing';

import { OperarioEspecialidadService } from './operario-especialidad.service';

describe('OperarioEspecialidadService', () => {
  let service: OperarioEspecialidadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OperarioEspecialidadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
