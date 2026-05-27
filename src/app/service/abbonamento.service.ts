// Import principali Angular e RxJS
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoAbbonamentoDTO } from '../dto/response/abbonamento-response.dto';

/**
 * abbonamento.service.ts
 * Mapping API Backend invocati:
 * - getAll -> GET [Backend: AbbonamentoController]
 * - getById -> GET [Backend: AbbonamentoController]
 * - create -> POST [Backend: AbbonamentoController]
 * - update -> PUT [Backend: AbbonamentoController]
 * - delete -> DELETE [Backend: AbbonamentoController]
 */

@Injectable({
  providedIn: 'root'
})
export class AbbonamentoService {
  // Endpoint API principale
  private apiUrl = '/api/abbonamenti';

  // Iniezione HttpClient
  constructor(private http: HttpClient) {}

  getAll(): Observable<TipoAbbonamentoDTO[]> {
    return this.http.get<TipoAbbonamentoDTO[]>(this.apiUrl);
  }

  getById(id: number): Observable<TipoAbbonamentoDTO> {
    return this.http.get<TipoAbbonamentoDTO>(`${this.apiUrl}/${id}`);
  }

  // Creazione nuovo abbonamento
  create(abbonamento: TipoAbbonamentoDTO): Observable<TipoAbbonamentoDTO> {
    return this.http.post<TipoAbbonamentoDTO>(this.apiUrl, abbonamento);
  }

  update(id: number, abbonamento: TipoAbbonamentoDTO): Observable<TipoAbbonamentoDTO> {
    return this.http.put<TipoAbbonamentoDTO>(`${this.apiUrl}/${id}`, abbonamento);
  }

  // Eliminazione abbonamento
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
