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

  // Recupera i ticket di assistenza aperti da un utente specifico. Utilizzato in area-personale/assistenza
  getByUtente(cf: string): Observable<AssistenzaResponseDTO[]> {
    return this.http.get<AssistenzaResponseDTO[]>(`${this.apiUrl}/utente/${cf}`);
  }

  // Apre un nuovo ticket di assistenza. Utilizzato in area-personale/assistenza
  apriTicket(request: AssistenzaRequestDTO): Observable<AssistenzaResponseDTO> {
    return this.http.post<AssistenzaResponseDTO>(`${this.apiUrl}/apri`, request);
  }

  // Recupera tutti i ticket di assistenza. Utilizzato in admin dashboard
  getAll(): Observable<AssistenzaResponseDTO[]> {
    return this.http.get<AssistenzaResponseDTO[]>(`${this.apiUrl}`);
  }

  // Filtra i ticket in base allo stato (es. APERTO, IN_LAVORAZIONE). Utilizzato in risolvi-assistenze
  getByStato(stato: string): Observable<AssistenzaResponseDTO[]> {
    return this.http.get<AssistenzaResponseDTO[]>(`${this.apiUrl}/stato/${stato}`);
  }

  // Recupera i ticket presi in carico da uno specifico assistente. Utilizzato in risolvi-assistenze
  getByAssistente(cf: string): Observable<AssistenzaResponseDTO[]> {
    return this.http.get<AssistenzaResponseDTO[]>(`${this.apiUrl}/assistente/${cf}`);
  }

  // Assegna un ticket a un assistente. Utilizzato in risolvi-assistenze
  prendiInCarico(id: number, cfAssistente: string): Observable<AssistenzaResponseDTO> {
    return this.http.put<AssistenzaResponseDTO>(`${this.apiUrl}/${id}/prendi-in-carico/${cfAssistente}`, {});
  }

  // Chiude un ticket fornendo una risposta. Utilizzato in risolvi-assistenze
  risolviTicket(id: number, risposta: string): Observable<AssistenzaResponseDTO> {
    return this.http.put<AssistenzaResponseDTO>(`${this.apiUrl}/${id}/risolvi`, { risposta });
  }

  // Permette all'utente di dare un voto al ticket risolto. Utilizzato in area-personale/assistenza
  valutaTicket(id: number, voto: number): Observable<AssistenzaResponseDTO> {
    return this.http.put<AssistenzaResponseDTO>(`${this.apiUrl}/${id}/valuta/${voto}`, {});
  }
}
