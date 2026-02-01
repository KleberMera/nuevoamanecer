import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPrestamo } from './lista-prestamo';

describe('ListaPrestamo', () => {
  let component: ListaPrestamo;
  let fixture: ComponentFixture<ListaPrestamo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaPrestamo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaPrestamo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
