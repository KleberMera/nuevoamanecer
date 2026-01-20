import { TestBed } from '@angular/core/testing';

import { RegistroAccionService } from './registro-accion-service';

describe('RegistroAccionService', () => {
  let service: RegistroAccionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistroAccionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
