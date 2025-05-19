import { TestBed } from '@angular/core/testing';

import { ProcedimientoService } from './procedimiento.service';

describe('ProcedimientoService', () => {
  let service: ProcedimientoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcedimientoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
