import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * sponsorizzazione.service.ts
 * Mapping API Backend invocati:
 * - getAll -> GET [Backend: SponsorizzazioneController]
 * - getById -> GET [Backend: SponsorizzazioneController]
 * - create -> POST [Backend: SponsorizzazioneController]
 * - update -> PUT [Backend: SponsorizzazioneController]
 * - delete -> DELETE [Backend: SponsorizzazioneController]
 */

export interface Sponsorizzazione {
  idSponsorizzazione?: number;
  importo?: number;
  dataInizio?: string;
  dataFine?: string;
  posizione?: string;
  sponsor?: any; // Dettagli dello sponsor associato
  squadra?: any; 
  impianto?: any;
}

@Injectable({
  providedIn: 'root'
})
export class SponsorizzazioneService {
  private apiUrl = '/api/sponsorizzazioni';

  constructor(private http: HttpClient) {}

  // Recupera tutti i record dal database. Utilizzato per listati generici.
  getAll(): Observable<Sponsorizzazione[]> {
    return this.http.get<Sponsorizzazione[]>(this.apiUrl);
  }

  // Recupera i dettagli di una singola entità tramite ID.
  getById(id: number): Observable<Sponsorizzazione> {
    return this.http.get<Sponsorizzazione>(`${this.apiUrl}/${id}`);
  }

  // Invia al backend i dati per creare una nuova entità.
  create(sponsorizzazione: Sponsorizzazione): Observable<Sponsorizzazione> {
    return this.http.post<Sponsorizzazione>(this.apiUrl, sponsorizzazione);
  }

  // Invia al backend i dati per aggiornare un'entità esistente.
  update(id: number, sponsorizzazione: Sponsorizzazione): Observable<Sponsorizzazione> {
    return this.http.put<Sponsorizzazione>(`${this.apiUrl}/${id}`, sponsorizzazione);
  }

  // Rimuove fisicamente l'entità dal database tramite DELETE.
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
