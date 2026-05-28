import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagamentoResponseDTO } from '../dto/response/transazioni-response.dto';

/**
 * pagamento.service.ts
 * Mapping API Backend invocati:
 * - getAll -> GET [Backend: PagamentoController]
 * - getById -> GET [Backend: PagamentoController]
 * - create -> POST [Backend: PagamentoController]
 * - update -> PUT [Backend: PagamentoController]
 * - delete -> DELETE [Backend: PagamentoController]
 */

@Injectable({
  providedIn: 'root'
})
export class PagamentoService {
  private apiUrl = '/api/pagamenti';

  constructor(private http: HttpClient) {}

  // Recupera tutti i record dal database. Utilizzato per listati generici.
  getAll(): Observable<PagamentoResponseDTO[]> {
    return this.http.get<PagamentoResponseDTO[]>(this.apiUrl);
  }

  // Recupera i dettagli di una singola entità tramite ID.
  getById(id: number): Observable<PagamentoResponseDTO> {
    return this.http.get<PagamentoResponseDTO>(`${this.apiUrl}/${id}`);
  }

  // Invia al backend i dati per creare una nuova entità.
  create(pagamento: PagamentoResponseDTO): Observable<PagamentoResponseDTO> {
    return this.http.post<PagamentoResponseDTO>(this.apiUrl, pagamento);
  }

  // Invia al backend i dati per aggiornare un'entità esistente.
  update(id: number, pagamento: PagamentoResponseDTO): Observable<PagamentoResponseDTO> {
    return this.http.put<PagamentoResponseDTO>(`${this.apiUrl}/${id}`, pagamento);
  }

  // Rimuove fisicamente l'entità dal database tramite DELETE.
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
