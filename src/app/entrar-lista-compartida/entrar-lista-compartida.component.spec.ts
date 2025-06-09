import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrarListaCompartidaComponent } from './entrar-lista-compartida.component';

describe('EntrarListaCompartidaComponent', () => {
  let component: EntrarListaCompartidaComponent;
  let fixture: ComponentFixture<EntrarListaCompartidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntrarListaCompartidaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntrarListaCompartidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
