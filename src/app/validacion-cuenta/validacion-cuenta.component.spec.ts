import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidacionCuentaComponent } from './validacion-cuenta.component';

describe('ValidacionCuentaComponent', () => {
  let component: ValidacionCuentaComponent;
  let fixture: ComponentFixture<ValidacionCuentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidacionCuentaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidacionCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
