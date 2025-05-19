import { TestBed } from '@angular/core/testing';

import { EspecialidadMaquinariaService } from './especialidad-maquina.service';

describe('EspecialidadMaquinariaService', () => {
  let service: EspecialidadMaquinariaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EspecialidadMaquinariaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
