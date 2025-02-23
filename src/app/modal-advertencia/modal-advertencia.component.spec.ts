import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAdvertenciaComponent } from './modal-advertencia.component';

describe('ModalAdvertenciaComponent', () => {
  let component: ModalAdvertenciaComponent;
  let fixture: ComponentFixture<ModalAdvertenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAdvertenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAdvertenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
