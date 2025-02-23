import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestorListaCompartidaComponent } from './gestor-lista-compartida.component';

describe('GestorListaCompartidaComponent', () => {
  let component: GestorListaCompartidaComponent;
  let fixture: ComponentFixture<GestorListaCompartidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestorListaCompartidaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestorListaCompartidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
