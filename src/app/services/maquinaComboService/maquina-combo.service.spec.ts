import { TestBed } from '@angular/core/testing';

import { MaquinaComboService } from './maquina-combo.service';

describe('MaquinaComboService', () => {
  let service: MaquinaComboService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaquinaComboService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
