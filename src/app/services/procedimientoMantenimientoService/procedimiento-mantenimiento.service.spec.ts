import { TestBed } from '@angular/core/testing';

import { ProcedimientoMantenimientoService } from './procedimiento-mantenimiento.service';

describe('ProcedimientoMantenimientoService', () => {
  let service: ProcedimientoMantenimientoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcedimientoMantenimientoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
