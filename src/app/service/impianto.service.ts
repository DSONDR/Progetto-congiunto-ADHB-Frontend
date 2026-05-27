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

  getAll(): Observable<Impianto[]> {
    return this.http.get<Impianto[]>(this.apiUrl);
  }

  getById(id: number): Observable<Impianto> {
    return this.http.get<Impianto>(`${this.apiUrl}/${id}`);
  }

  create(impianto: Impianto): Observable<Impianto> {
    return this.http.post<Impianto>(this.apiUrl, impianto);
  }

  update(id: number, impianto: Impianto): Observable<Impianto> {
    return this.http.put<Impianto>(`${this.apiUrl}/${id}`, impianto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
