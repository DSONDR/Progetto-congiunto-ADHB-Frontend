import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsaAbbonamentoRequest } from '../dto/request/iscrizioni-request.dto';

/**
 * usa-abbonamento.service.ts
 * Mapping API Backend invocati:
 * - getAll -> GET [Backend: Usa-abbonamentoController]
 * - getById -> GET [Backend: Usa-abbonamentoController]
 * - create -> POST [Backend: Usa-abbonamentoController]
 * - update -> PUT [Backend: Usa-abbonamentoController]
 * - delete -> DELETE [Backend: Usa-abbonamentoController]
 */

@Injectable({
  providedIn: 'root'
})
export class UsaAbbonamentoService {
  private apiUrl = '/api/usa-abb';

  constructor(private http: HttpClient) {}

  getAll(): Observable<UsaAbbonamentoRequest[]> {
    return this.http.get<UsaAbbonamentoRequest[]>(this.apiUrl);
  }

  getById(id: number): Observable<UsaAbbonamentoRequest> {
    return this.http.get<UsaAbbonamentoRequest>(`${this.apiUrl}/${id}`);
  }

  create(usaAbbonamento: UsaAbbonamentoRequest): Observable<UsaAbbonamentoRequest> {
    return this.http.post<UsaAbbonamentoRequest>(this.apiUrl, usaAbbonamento);
  }

  update(id: number, usaAbbonamento: UsaAbbonamentoRequest): Observable<UsaAbbonamentoRequest> {
    return this.http.put<UsaAbbonamentoRequest>(`${this.apiUrl}/${id}`, usaAbbonamento);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
