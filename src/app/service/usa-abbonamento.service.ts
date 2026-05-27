// Import Angular e RxJS
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// DTO richiesta
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
  // Endpoint API principale
  private apiUrl = '/api/usa-abb';

  constructor(private http: HttpClient) {}

  // Recupera tutti i record
  getAll(): Observable<UsaAbbonamentoRequest[]> {
    return this.http.get<UsaAbbonamentoRequest[]>(this.apiUrl);
  }

  // Recupera record tramite ID
  getById(id: number): Observable<UsaAbbonamentoRequest> {
    return this.http.get<UsaAbbonamentoRequest>(`${this.apiUrl}/${id}`);
  }

  // Creazione nuovo utilizzo abbonamento
  create(usaAbbonamento: UsaAbbonamentoRequest): Observable<UsaAbbonamentoRequest> {
    return this.http.post<UsaAbbonamentoRequest>(this.apiUrl, usaAbbonamento);
  }

  // Aggiornamento record
  update(id: number, usaAbbonamento: UsaAbbonamentoRequest): Observable<UsaAbbonamentoRequest> {
    return this.http.put<UsaAbbonamentoRequest>(`${this.apiUrl}/${id}`, usaAbbonamento);
  }

  // Eliminazione record
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
