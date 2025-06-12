import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BankAccount {
  bankAccountID?: number;
  accountNumber: string;
  accountHolder: string;
  bankId: number;
  ifsc: string;
}

@Injectable({
  providedIn: 'root'
})
export class BankAccountService {
  readonly APIUrl = 'http://localhost:5272/api/BankAccount'; 

  constructor(private http: HttpClient) {}

  getAll(): Observable<BankAccount[]> {
    return this.http.get<BankAccount[]>(this.APIUrl);
  }

  create(data: BankAccount): Observable<BankAccount> {
    return this.http.post<BankAccount>(this.APIUrl, data);
  }

  createMany(data: BankAccount[]): Observable<any> {
    return this.http.post(this.APIUrl, data);
  }

  update(id: number, data: BankAccount): Observable<any> {
    return this.http.put(`${this.APIUrl}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.APIUrl}/${id}`);
  }
}
