import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsaAbbonamento } from '../models/usa-abbonamento.model';

@Injectable({
  providedIn: 'root'
})
export class UsaAbbonamentoService {
  private apiUrl = '/api/usa-abb';

  constructor(private http: HttpClient) {}

  getAll(): Observable<UsaAbbonamento[]> {
    return this.http.get<UsaAbbonamento[]>(this.apiUrl);
  }

  getById(id: number): Observable<UsaAbbonamento> {
    return this.http.get<UsaAbbonamento>(`${this.apiUrl}/${id}`);
  }

  create(usaAbbonamento: UsaAbbonamento): Observable<UsaAbbonamento> {
    return this.http.post<UsaAbbonamento>(this.apiUrl, usaAbbonamento);
  }

  update(id: number, usaAbbonamento: UsaAbbonamento): Observable<UsaAbbonamento> {
    return this.http.put<UsaAbbonamento>(`${this.apiUrl}/${id}`, usaAbbonamento);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
