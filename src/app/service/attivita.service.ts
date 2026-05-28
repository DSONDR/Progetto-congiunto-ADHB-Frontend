import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AttivitaResponseDTO } from '../dto/response/attivita-response.dto';

/**
 * attivita.service.ts
 * Mapping API Backend invocati:
 * - getAll -> GET [Backend: AttivitaGestioneController / AttivitaVisualizzazioneController]
 * - getById -> GET [Backend: AttivitaGestioneController / AttivitaVisualizzazioneController]
 * - create -> POST [Backend: AttivitaGestioneController / AttivitaVisualizzazioneController]
 * - update -> PUT [Backend: AttivitaGestioneController / AttivitaVisualizzazioneController]
 * - delete -> DELETE [Backend: AttivitaGestioneController / AttivitaVisualizzazioneController]
 * - filtra -> GET [Backend: AttivitaGestioneController / AttivitaVisualizzazioneController]
 * - getTipiEvento -> GET [Backend: AttivitaGestioneController / AttivitaVisualizzazioneController]
 * - getDestinatari -> GET [Backend: AttivitaGestioneController / AttivitaVisualizzazioneController]
 */

@Injectable({
  providedIn: 'root'
})
export class AttivitaService {
  private apiVisualizzazioneUrl = '/api/attivita';
  private apiGestioneUrl = '/api/attivita-gestione';

  constructor(private http: HttpClient) {}

  // Recupera tutte le attività pubbliche. Utilizzato in vetrina eventi e calendario
  getAll(): Observable<AttivitaResponseDTO[]> {
    return this.http.get<AttivitaResponseDTO[]>(this.apiVisualizzazioneUrl);
  }

  // Recupera i dettagli di una singola attività tramite ID. Utilizzato nei modali di dettaglio
  getById(id: number): Observable<AttivitaResponseDTO> {
    return this.http.get<AttivitaResponseDTO>(`${this.apiVisualizzazioneUrl}/${id}`);
  }

  // Crea una nuova attività/evento nel sistema (solo Admin). Utilizzato in gestione-attivita
  create(attivita: AttivitaResponseDTO): Observable<AttivitaResponseDTO> {
    return this.http.post<AttivitaResponseDTO>(this.apiGestioneUrl, attivita);
  }

  // Aggiorna un'attività esistente. Utilizzato in gestione-attivita
  update(id: number, attivita: AttivitaResponseDTO): Observable<AttivitaResponseDTO> {
    return this.http.put<AttivitaResponseDTO>(`${this.apiGestioneUrl}/${id}`, attivita);
  }

  // Elimina un'attività. Utilizzato in gestione-attivita
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiGestioneUrl}/${id}`);
  }

  // Filtra le attività in base ai parametri dinamici (es. Sede, Tipo Evento, Categoria). Utilizzato in eventi e calendario
  filtra(params: { idImpianto?: number; prezzo?: number; target?: string; tipoEvento?: string; squadraId?: number; istruttoreCf?: string; inizio?: string; fine?: string; }): Observable<AttivitaResponseDTO[]> {
    let httpParams = new HttpParams();
    // Per i parametri numerici necessario il != null, perchè altrimenti non passerebbero il parametro se =0
    if (params.idImpianto != null) {
      httpParams = httpParams.set('idImpianto', params.idImpianto.toString());
    }
    // Per i parametri numerici necessario il != null, perchè altrimenti non passerebbero il parametro se =0
    if (params.prezzo != null) {
      httpParams = httpParams.set('prezzo', params.prezzo.toString());
    }
    if (params.target) {
      httpParams = httpParams.set('target', params.target);
    }
    if (params.tipoEvento) {
      httpParams = httpParams.set('tipoEvento', params.tipoEvento);
    }
    // Per i parametri numerici necessario il != null, perchè altrimenti non passerebbero il parametro se =0
    if (params.squadraId != null) {
      httpParams = httpParams.set('squadraId', params.squadraId.toString());
    }
    if (params.istruttoreCf) {
      httpParams = httpParams.set('istruttoreCf', params.istruttoreCf);
    }
    if (params.inizio) {
      httpParams = httpParams.set('inizio', params.inizio);
    }
    if (params.fine) {
      httpParams = httpParams.set('fine', params.fine);
    }
    return this.http.get<AttivitaResponseDTO[]>(`${this.apiVisualizzazioneUrl}/filtra`, { params: httpParams });
  }

  // Recupera i tipi di eventi distinti disponibili nel DB (es. SPORT, CORSO). Utilizzato nei filtri di ricerca
  getTipiEvento(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiVisualizzazioneUrl}/tipi-evento`);
  }

  // Recupera le categorie/destinatari unici per gli eventi (es. Adulti, Bambini). Utilizzato nei filtri di ricerca
  getDestinatari(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiVisualizzazioneUrl}/destinatari`);
  }
}
