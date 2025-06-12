import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BankAccountService } from '../shared/bank-account.service';
import { BankService } from '../shared/bank.service';
import { BankAccount } from '../shared/bank-account.service';

import { Bank } from '../shared/bank.models';   

@Component({
  selector: 'app-bank-account',
  templateUrl: './bank-account.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class BankAccountComponent implements OnInit {
  form!: FormGroup;
  banks: Bank[] = []; 

  get bankAccountForms(): FormArray {
    return this.form.get('bankAccountForms') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private bankService: BankService,              
    private bankAccountService: BankAccountService 
  ) {}
ngOnInit(): void {
  this.form = this.fb.group({
    bankAccountForms: this.fb.array([])
  });

  this.bankService.getAll().subscribe({
    next: (banks) => {
      this.banks = banks;

      this.bankAccountService.getAll().subscribe({
        next: (accounts) => {
          accounts.forEach(account => this.addBankAccountForm(account));
        },
        error: err => console.error('Failed to load accounts', err)
      });
    },
    error: err => console.error('Failed to load banks', err)
  });
}

  

  loadBanks(): void {
    this.bankService.getAll().subscribe({
      next: (data) => {
        this.banks = data;
        console.log('Loaded banks:', this.banks);
        this.addBankAccountForm();
      },
      error: (err) => {
        console.error('Failed to load banks', err);
        this.addBankAccountForm();
      }
    });
  }

  addBankAccountForm(data?: BankAccount): void {
  this.bankAccountForms.push(this.fb.group({
    bankAccountID: [data?.bankAccountID || 0],
    accountNumber: [data?.accountNumber || '', Validators.required],
    accountHolder: [data?.accountHolder || '', Validators.required],
    bankId: [data?.bankId || 0, Validators.required],
    ifsc: [data?.ifsc || '', Validators.required]
  }));
}


  removeBankAccountForm(index: number): void {
    if (this.bankAccountForms.length > 1) {
      this.bankAccountForms.removeAt(index);
    }
  }
  
  
  
onSubmit(i: number): void {
  const row = this.bankAccountForms.at(i);
  
  if (!row) {
    console.error('No form row exists at index:', i);
    return;
  }

  if (row.invalid) {
    alert('Please fill all required fields.');
    return;
  }

  const account: BankAccount = row.value;

  if (account.bankAccountID === 0) {
    this.bankAccountService.create(account).subscribe({
      next: (res) => {
        console.log('Saved:', res);
        this.bankAccountForms.at(i)?.patchValue({ bankAccountID: res.bankAccountID });
        alert('Record saved.');
      },
      error: (err) => console.error('Save error', err)
    });
  } else {
    if (account.bankAccountID !== undefined) {
      this.bankAccountService.update(account.bankAccountID, account).subscribe({
        next: () => alert('Record updated.'),
        error: err => console.error('Update failed', err)
      });
    } else {
      console.error('Cannot update: bankAccountID is undefined');
    }
  }
}


onDelete(i: number, account: BankAccount): void {
  const isNew = !account.bankAccountID || account.bankAccountID === 0;

  if (!isNew) {
    if (confirm("Are you sure you want to delete this record?")) {
      this.bankAccountService.delete(account.bankAccountID!).subscribe({
        next: () => {
          alert("Deleted successfully");

          // Clear the values instead of removing the row
          this.bankAccountForms.at(i).patchValue({
            bankAccountID: 0,
            accountNumber: '',
            accountHolder: '',
            bankId: 0,
            ifsc: ''
          });
        },
        error: (err) => console.error("Delete error", err)
      });
    }
  } else {
    this.bankAccountForms.removeAt(i);
  }
}


}


 





