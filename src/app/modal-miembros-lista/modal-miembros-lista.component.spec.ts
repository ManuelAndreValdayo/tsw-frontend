import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMiembrosListaComponent } from './modal-miembros-lista.component';

describe('ModalMiembrosListaComponent', () => {
  let component: ModalMiembrosListaComponent;
  let fixture: ComponentFixture<ModalMiembrosListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalMiembrosListaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalMiembrosListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
