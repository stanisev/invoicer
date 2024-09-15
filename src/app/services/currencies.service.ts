import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Currency } from '../models/currency';

@Injectable({
  providedIn: 'root'
})
export class CurrenciesService {
  private readonly currenciesUrl = 'assets/resources/currencies.json';

  constructor(private http: HttpClient) {}

  buildCurrencies(): Observable<Currency[]> {
    return this.http.get<Currency[]>(this.currenciesUrl);
  }
}
