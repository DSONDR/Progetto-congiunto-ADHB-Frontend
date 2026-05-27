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

  getAll(): Observable<PagamentoResponseDTO[]> {
    return this.http.get<PagamentoResponseDTO[]>(this.apiUrl);
  }

  getById(id: number): Observable<PagamentoResponseDTO> {
    return this.http.get<PagamentoResponseDTO>(`${this.apiUrl}/${id}`);
  }

  create(pagamento: PagamentoResponseDTO): Observable<PagamentoResponseDTO> {
    return this.http.post<PagamentoResponseDTO>(this.apiUrl, pagamento);
  }

  update(id: number, pagamento: PagamentoResponseDTO): Observable<PagamentoResponseDTO> {
    return this.http.put<PagamentoResponseDTO>(`${this.apiUrl}/${id}`, pagamento);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
