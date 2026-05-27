import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AssistenzaRequestDTO } from '../dto/request/assistenza-request.dto';
import { AssistenzaResponseDTO } from '../dto/response/assistenza-response.dto';

/**
 * assistenza.service.ts
 * Mapping API Backend invocati:
 * - getByUtente -> GET [Backend: AssistenzaController]
 * - apriTicket -> POST [Backend: AssistenzaController]
 * - getAll -> GET [Backend: AssistenzaController]
 * - getByStato -> GET [Backend: AssistenzaController]
 * - getByAssistente -> GET [Backend: AssistenzaController]
 * - prendiInCarico -> PUT [Backend: AssistenzaController]
 * - risolviTicket -> PUT [Backend: AssistenzaController]
 * - valutaTicket -> PUT [Backend: AssistenzaController]
 */

@Injectable({
  providedIn: 'root'
})
export class AssistenzaService {
  private apiUrl = 'http://localhost:8080/api/assistenza';

  constructor(private http: HttpClient) {}

  getByUtente(cf: string): Observable<AssistenzaResponseDTO[]> {
    return this.http.get<AssistenzaResponseDTO[]>(`${this.apiUrl}/utente/${cf}`);
  }

  apriTicket(request: AssistenzaRequestDTO): Observable<AssistenzaResponseDTO> {
    return this.http.post<AssistenzaResponseDTO>(`${this.apiUrl}/apri`, request);
  }

  getAll(): Observable<AssistenzaResponseDTO[]> {
    return this.http.get<AssistenzaResponseDTO[]>(`${this.apiUrl}`);
  }

  getByStato(stato: string): Observable<AssistenzaResponseDTO[]> {
    return this.http.get<AssistenzaResponseDTO[]>(`${this.apiUrl}/stato/${stato}`);
  }

  getByAssistente(cf: string): Observable<AssistenzaResponseDTO[]> {
    return this.http.get<AssistenzaResponseDTO[]>(`${this.apiUrl}/assistente/${cf}`);
  }

  prendiInCarico(id: number, cfAssistente: string): Observable<AssistenzaResponseDTO> {
    return this.http.put<AssistenzaResponseDTO>(`${this.apiUrl}/${id}/prendi-in-carico/${cfAssistente}`, {});
  }

  risolviTicket(id: number, risposta: string): Observable<AssistenzaResponseDTO> {
    return this.http.put<AssistenzaResponseDTO>(`${this.apiUrl}/${id}/risolvi`, { risposta });
  }

  valutaTicket(id: number, voto: number): Observable<AssistenzaResponseDTO> {
    return this.http.put<AssistenzaResponseDTO>(`${this.apiUrl}/${id}/valuta/${voto}`, {});
  }
}
