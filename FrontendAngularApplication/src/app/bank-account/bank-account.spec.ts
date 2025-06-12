import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAccount } from './bank-account';

describe('BankAccount', () => {
  let component: BankAccount;
  let fixture: ComponentFixture<BankAccount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankAccount]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankAccount);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
