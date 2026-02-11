import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistPeriodo } from './dist-periodo';

describe('DistPeriodo', () => {
  let component: DistPeriodo;
  let fixture: ComponentFixture<DistPeriodo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DistPeriodo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DistPeriodo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
