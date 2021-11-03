import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositoCartaoComponent } from './deposito-cartao.component';

describe('DepositoCartaoComponent', () => {
  let component: DepositoCartaoComponent;
  let fixture: ComponentFixture<DepositoCartaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepositoCartaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositoCartaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
