import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MtoUrlComponent } from './mto-url.component';

describe('MtoUrlComponent', () => {
  let component: MtoUrlComponent;
  let fixture: ComponentFixture<MtoUrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MtoUrlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MtoUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
