import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Abbonamento } from '../dto/abbonamento.model';

@Injectable({
  providedIn: 'root'
})
export class AbbonamentoService {
  private apiUrl = '/api/abbonamenti';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Abbonamento[]> {
    return this.http.get<Abbonamento[]>(this.apiUrl);
  }

  getById(id: number): Observable<Abbonamento> {
    return this.http.get<Abbonamento>(`${this.apiUrl}/${id}`);
  }

  create(abbonamento: Abbonamento): Observable<Abbonamento> {
    return this.http.post<Abbonamento>(this.apiUrl, abbonamento);
  }

  update(id: number, abbonamento: Abbonamento): Observable<Abbonamento> {
    return this.http.put<Abbonamento>(`${this.apiUrl}/${id}`, abbonamento);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
