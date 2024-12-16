import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBankAccountGenericComponent } from './add-bank-account-generic.component';

describe('AddBankAccountGenericComponent', () => {
  let component: AddBankAccountGenericComponent;
  let fixture: ComponentFixture<AddBankAccountGenericComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBankAccountGenericComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBankAccountGenericComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
