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
 * - getTipiAbbonamento -> GET [Backend: AbbonamentoController.getTipiAbbonamento]
 */

@Injectable({
  providedIn: 'root'
})
export class AbbonamentoService {
  // Endpoint API principale
  private apiUrl = 'http://localhost:8080/api/abbonamenti';

  // Iniezione HttpClient
  constructor(private http: HttpClient) { }

  // Recupera tutti gli abbonamenti esistenti. Utilizzato in admin dashboard.
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Recupera i dettagli di uno specifico abbonamento
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Recupera il listino dei tipi di abbonamento. Chiamato da: AbbonamentiMenuComponent
  getTipiAbbonamento(): Observable<TipoAbbonamentoDTO[]> {
    return this.http.get<TipoAbbonamentoDTO[]>(`${this.apiUrl}/tipi`);
  }
}
