import { TestBed } from '@angular/core/testing';

import { DettPrestamoService } from './dett-prestamo-service';

describe('DettPrestamoService', () => {
  let service: DettPrestamoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DettPrestamoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
