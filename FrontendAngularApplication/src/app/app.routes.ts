import { Route } from '@angular/router';
import { BankAccountComponent } from './bank-account/bank-account';

export const routes: Route[] = [
  { path: '', redirectTo: 'bank-account', pathMatch: 'full' },
  { path: 'bank-account', component: BankAccountComponent },
  { path: '**', redirectTo: 'bank-account' },
];
