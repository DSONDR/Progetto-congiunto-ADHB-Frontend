import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * impianto.service.ts
 * Mapping API Backend invocati:
 * - getAll -> GET [Backend: ImpiantoController]
 * - getById -> GET [Backend: ImpiantoController]
 * - create -> POST [Backend: ImpiantoController]
 * - update -> PUT [Backend: ImpiantoController]
 * - delete -> DELETE [Backend: ImpiantoController]
 */

export interface Impianto {
  id: number;
  nome: string;
  tipoImpianto: string;
  stato: string;
  omologazione: string;
}

@Injectable({
  providedIn: 'root'
})
export class ImpiantoService {
  private apiUrl = '/api/impianto';

  constructor(private http: HttpClient) {}

  // Recupera tutti i record dal database. Utilizzato per listati generici.
  getAll(): Observable<Impianto[]> {
    return this.http.get<Impianto[]>(this.apiUrl);
  }

  // Recupera i dettagli di una singola entità tramite ID.
  getById(id: number): Observable<Impianto> {
    return this.http.get<Impianto>(`${this.apiUrl}/${id}`);
  }

  // Invia al backend i dati per creare una nuova entità.
  create(impianto: Impianto): Observable<Impianto> {
    return this.http.post<Impianto>(this.apiUrl, impianto);
  }

  // Invia al backend i dati per aggiornare un'entità esistente.
  update(id: number, impianto: Impianto): Observable<Impianto> {
    return this.http.put<Impianto>(`${this.apiUrl}/${id}`, impianto);
  }

  // Rimuove fisicamente l'entità dal database tramite DELETE.
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
