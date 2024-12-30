import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBankAccountModalComponent } from './add-bank-account-modal.component';

describe('AddBankAccountModalComponent', () => {
  let component: AddBankAccountModalComponent;
  let fixture: ComponentFixture<AddBankAccountModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBankAccountModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBankAccountModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
