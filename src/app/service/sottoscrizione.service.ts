import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SottoscrizioneResponseDTO, Sottoscrizione, Abbonamento } from '../dto/response/abbonamento-response.dto';

/**
 * sottoscrizione.service.ts
 * Mapping API Backend invocati:
 * - getAbbonamentiAtleta -> GET [Backend: SottoscrizioneController]
 * - getAll -> GET [Backend: SottoscrizioneController]
 * - getById -> GET [Backend: SottoscrizioneController]
 * - create -> POST [Backend: SottoscrizioneController]
 * - update -> PUT [Backend: SottoscrizioneController]
 * - delete -> DELETE [Backend: SottoscrizioneController]
 * - getStoricoUtente -> GET [Backend: SottoscrizioneController]
 * - sottoscrivi -> POST [Backend: SottoscrizioneController]
 * - rinnova -> POST [Backend: SottoscrizioneController]
 */

@Injectable({
  providedIn: 'root'
})
export class SottoscrizioneService {
  private apiUrl = 'http://localhost:8080/api/sottoscrizioni';

  constructor(private http: HttpClient) {}

  // Esegue l'operazione di getAbbonamentiAtleta comunicando con il backend.
  getAbbonamentiAtleta(cf: string): Observable<Abbonamento[]> {
    return this.http.get<Abbonamento[]>(`${this.apiUrl}/abbonamenti/${cf}`);
  }

  // Recupera tutti i record dal database. Utilizzato per listati generici.
  getAll(): Observable<SottoscrizioneResponseDTO[]> {
    return this.http.get<SottoscrizioneResponseDTO[]>(this.apiUrl);
  }

  // Recupera i dettagli di una singola entità tramite ID.
  getById(id: number): Observable<SottoscrizioneResponseDTO> {
    return this.http.get<SottoscrizioneResponseDTO>(`${this.apiUrl}/${id}`);
  }

  // Invia al backend i dati per creare una nuova entità.
  create(sottoscrizione: SottoscrizioneResponseDTO): Observable<SottoscrizioneResponseDTO> {
    return this.http.post<SottoscrizioneResponseDTO>(this.apiUrl, sottoscrizione);
  }

  // Invia al backend i dati per aggiornare un'entità esistente.
  update(id: number, sottoscrizione: SottoscrizioneResponseDTO): Observable<SottoscrizioneResponseDTO> {
    return this.http.put<SottoscrizioneResponseDTO>(`${this.apiUrl}/${id}`, sottoscrizione);
  }

  // Elimina definitivamente una sottoscrizione dal sistema (usato in area-personale/abbonamenti)
  delete(numeroAbb: number, idPagamento: number, cf: string): Observable<number> {
    return this.http.delete<number>(`${this.apiUrl}/${numeroAbb}/${idPagamento}/${cf}`);
  }

  // Recupera lo storico degli acquisti di un utente
  getStoricoUtente(cf: string): Observable<Sottoscrizione[]> {
    return this.http.get<Sottoscrizione[]>(`${this.apiUrl}/storicoUtente/${cf}`);
  }

  // Effettua una nuova sottoscrizione scegliendola dal listino
  sottoscrivi(request: any): Observable<SottoscrizioneResponseDTO> {
    return this.http.post<SottoscrizioneResponseDTO>(`${this.apiUrl}/sottoscrivi`, request);
  }

  // Rinnova un abbonamento esistente scaduto o in scadenza
  rinnova(numeroAbb: number, metodo: string): Observable<Abbonamento> {
    return this.http.post<Abbonamento>(`${this.apiUrl}/rinnova/${numeroAbb}?metodo=${metodo}`, {});
  }
}
