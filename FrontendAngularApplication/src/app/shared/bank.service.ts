import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bank  } from './bank.models';


@Injectable({
  providedIn: 'root'  
})
export class BankService {
  readonly apiUrl = 'http://localhost:5272/api/Bank';  

  constructor(private http: HttpClient) {}
 
getAll() : Observable<Bank[]>{
  return this.http.get<Bank[]>(this.apiUrl);
}
}


