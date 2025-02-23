import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MtoListasComponent } from './mto-listas.component';

describe('MtoListasComponent', () => {
  let component: MtoListasComponent;
  let fixture: ComponentFixture<MtoListasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MtoListasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MtoListasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
