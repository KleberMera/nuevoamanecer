import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUsuario } from './dialog-usuario';

describe('DialogUsuario', () => {
  let component: DialogUsuario;
  let fixture: ComponentFixture<DialogUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogUsuario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogUsuario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
