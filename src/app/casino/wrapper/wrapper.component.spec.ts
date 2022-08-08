import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasinoWrapperComponent } from './wrapper.component';

describe('WrapperComponent', () => {
  let component: CasinoWrapperComponent;
  let fixture: ComponentFixture<CasinoWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CasinoWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CasinoWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
