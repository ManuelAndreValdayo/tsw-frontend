import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddListasComponent } from './modal-add-listas.component';

describe('ModalAddListasComponent', () => {
  let component: ModalAddListasComponent;
  let fixture: ComponentFixture<ModalAddListasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAddListasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAddListasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
