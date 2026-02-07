import { TestBed } from '@angular/core/testing';

import { PdfPagos } from './pdf-pagos';

describe('PdfPagos', () => {
  let service: PdfPagos;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfPagos);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
