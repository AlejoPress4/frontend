import { TestBed } from '@angular/core/testing';

import { NoAutenticadoGuard } from './no-autenticado.guard';

describe('NoAutenticadoGuard', () => {
  let guard: NoAutenticadoGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NoAutenticadoGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
