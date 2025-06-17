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

  originalAccounts : BankAccount[] = [];
ngOnInit(): void {
  this.form = this.fb.group({
    bankAccountForms: this.fb.array([])
  });

  this.bankService.getAll().subscribe({
    next: (banks) => {
      this.banks = banks;

      this.bankAccountService.getAll().subscribe({
        next: (accounts) => {
          accounts.forEach(account => {
          this.addBankAccountForm(account);
          this.originalAccounts.push(JSON.parse(JSON.stringify(account)));
          });
        },
        error: err => console.error('Failed to load accounts', err)
      });
    },
    error: err => console.error('Failed to load banks', err)
  });
}

  
loadAll(): void {
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


  addBankAccountForm(data?: BankAccount): void {
  this.bankAccountForms.push(this.fb.group({
    bankAccountID: [data?.bankAccountID || 0],
accountNumber: [
      data?.accountNumber || '',
      [
        Validators.required,
        Validators.pattern(/^\d+$/) // Only allow digits
      ]
    ],    accountHolder: [data?.accountHolder || '', Validators.required],
    bankId: [data?.bankId || 0, Validators.required],
    ifsc: [data?.ifsc || '', Validators.required]
  }));
}
  

 areAccountsEqual(a: BankAccount, b: BankAccount): boolean {
    return a.accountNumber === b.accountNumber &&
           a.accountHolder === b.accountHolder &&
           a.bankId === b.bankId &&
           a.ifsc === b.ifsc;
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
    // Check if account number already exists before saving new
    this.bankAccountService.getByAccountDetails(account).subscribe({
      next: (existingAccount) => {
        if (existingAccount) {
          alert('Account number already exists.');
        }
      },
      error: (err) => {
        if (err.status === 404) {
          // Proceed to save since it doesn't exist
          this.bankAccountService.create(account).subscribe({
            next: (res) => {
              this.bankAccountForms.at(i)?.patchValue({ bankAccountID: res.bankAccountID });
              this.originalAccounts[i] = JSON.parse(JSON.stringify(res)); // store new original
              alert('Record saved.');
              this.loadAll();
            },
            error: (err) => {
              console.error('Save error', err);
              const msg = err.error?.message || '';
              if (msg.includes('duplicate') || msg.includes('UNIQUE')) {
                alert('Account number already exists.');
              } else {
                alert(msg);
              }
            }
          });
        } else {
          alert('Failed to check if record exists.');
        }
      }
    });

    return;
  }

  // Account exists, now check for changes
  const original = this.originalAccounts[i];
  if (this.areAccountsEqual(account, original)) {
    alert('No changes made.');
    return;
  }

  // Proceed with update
  this.bankAccountService.update(account.bankAccountID!, account).subscribe({
    next: () => {
      this.originalAccounts[i] = JSON.parse(JSON.stringify(account)); // update original
      alert('Record updated.');
      this.loadAll();
    },
    error: (err) => {
      console.error('Update error', err);
      const msg = err.error?.message || 'Unknown error';
      alert(msg);
    }
  });
}


onDelete(i: number, account: BankAccount): void {
  const isNew = !account.bankAccountID || account.bankAccountID === 0;

  if (!isNew) {
    if (confirm("Are you sure you want to delete this record?")) {
      this.bankAccountService.delete(account.bankAccountID!).subscribe({
        next: () => {
          alert("Deleted successfully");
          this.loadAll();

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


 





