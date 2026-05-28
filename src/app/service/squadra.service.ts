import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserResponseDTO } from '../dto/response/user-response.dto';
import { SquadraResponseDTO } from '../dto/response/squadra-response.dto';

/**
 * squadra.service.ts
 * Mapping API Backend invocati:
 * - getAll -> GET [Backend: SquadraController]
 * - getById -> GET [Backend: SquadraController]
 * - create -> POST [Backend: SquadraController]
 * - update -> PUT [Backend: SquadraController]
 * - delete -> DELETE [Backend: SquadraController]
 * - getByAllenatore -> GET [Backend: SquadraController]
 * - getByAtleta -> GET [Backend: SquadraController]
 * - addAtletaToSquadra -> POST [Backend: SquadraController]
 * - rimuoviAtletaDaSquadra -> DELETE [Backend: SquadraController]
 * - getAtletiBySquadra -> GET [Backend: SquadraController]
 * - getAtletiScaduti -> GET [Backend: SquadraController]
 */

@Injectable({
  providedIn: 'root'
})
export class SquadraService {
  private apiUrl = '/api/squadre';

  constructor(private http: HttpClient) {}

  // Recupera tutti i record dal database. Utilizzato per listati generici.
  getAll(): Observable<SquadraResponseDTO[]> {
    return this.http.get<SquadraResponseDTO[]>(this.apiUrl);
  }

  // Recupera i dettagli di una singola entità tramite ID.
  getById(id: number): Observable<SquadraResponseDTO> {
    return this.http.get<SquadraResponseDTO>(`${this.apiUrl}/${id}`);
  }

  // Invia al backend i dati per creare una nuova entità.
  create(squadra: SquadraResponseDTO): Observable<SquadraResponseDTO> {
    return this.http.post<SquadraResponseDTO>(this.apiUrl, squadra);
  }

  // Invia al backend i dati per aggiornare un'entità esistente.
  update(id: number, squadra: SquadraResponseDTO): Observable<SquadraResponseDTO> {
    return this.http.put<SquadraResponseDTO>(`${this.apiUrl}/${id}`, squadra);
  }

  // Rimuove fisicamente l'entità dal database tramite DELETE.
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Esegue l'operazione di getByAllenatore comunicando con il backend.
  getByAllenatore(cf: string): Observable<SquadraResponseDTO[]> {
    return this.http.get<SquadraResponseDTO[]>(`${this.apiUrl}/per-allenatore/${cf}`);
  }

  // Esegue l'operazione di getByAtleta comunicando con il backend.
  getByAtleta(cf: string): Observable<SquadraResponseDTO[]> {
    return this.http.get<SquadraResponseDTO[]>(`${this.apiUrl}/per-atleta/${cf}`);
  }
  
  // Metodo per la relazione N:M
  addAtletaToSquadra(idSquadra: number, cfAtleta: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${idSquadra}/atleti/${cfAtleta}`, {});
  }

  // Esegue l'operazione di rimuoviAtletaDaSquadra comunicando con il backend.
  rimuoviAtletaDaSquadra(idSquadra: number, cfAtleta: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idSquadra}/atleti/${cfAtleta}`);
  }

  // Esegue l'operazione di getAtletiBySquadra comunicando con il backend.
  getAtletiBySquadra(id: number): Observable<UserResponseDTO[]> {
    return this.http.get<UserResponseDTO[]>(`${this.apiUrl}/${id}/atleti`);
  }

  // Esegue l'operazione di getAtletiScaduti comunicando con il backend.
  getAtletiScaduti(id: number): Observable<UserResponseDTO[]> {
    return this.http.get<UserResponseDTO[]>(`${this.apiUrl}/${id}/atleti/scaduti`);
}
}
