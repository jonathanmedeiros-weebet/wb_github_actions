import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBankAccountsComponent } from './list-bank-accounts.component';

describe('ListBankAccountsComponent', () => {
  let component: ListBankAccountsComponent;
  let fixture: ComponentFixture<ListBankAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListBankAccountsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListBankAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
