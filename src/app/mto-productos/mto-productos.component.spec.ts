import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MtoProductosComponent } from './mto-productos.component';

describe('MtoProductosComponent', () => {
  let component: MtoProductosComponent;
  let fixture: ComponentFixture<MtoProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MtoProductosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MtoProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
