import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAccion } from './dialog-accion';

describe('DialogAccion', () => {
  let component: DialogAccion;
  let fixture: ComponentFixture<DialogAccion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogAccion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogAccion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
