import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * utente.service.ts
 * Mapping API Backend invocati:
 * - getAll -> GET [Backend: UtenteController]
 * - getById -> GET [Backend: UtenteController]
 * - create -> POST [Backend: UtenteController]
 * - update -> PUT [Backend: UtenteController]
 * - delete -> DELETE [Backend: UtenteController]
 */
import { UserResponseDTO } from '../dto/response/user-response.dto';	//Import dal DTO

@Injectable({
  providedIn: 'root'
})
export class UtenteService {

  private apiUrl = '/api/utenti';

  constructor(private http: HttpClient) {}

  // Recupera tutti i record dal database. Utilizzato per listati generici.
  getAll(): Observable<UserResponseDTO[]> {
    return this.http.get<UserResponseDTO[]>(this.apiUrl);
  }

  // Recupera i dettagli di una singola entità tramite ID.
  getById(id: string): Observable<UserResponseDTO> {
    return this.http.get<UserResponseDTO>(`${this.apiUrl}/${id}`);
  }

  // Invia al backend i dati per creare una nuova entità.
  create(utente: UserResponseDTO): Observable<UserResponseDTO> {
    return this.http.post<UserResponseDTO>(this.apiUrl, utente);
  }

  // Invia al backend i dati per aggiornare un'entità esistente.
  update(id: string, utente: UserResponseDTO): Observable<UserResponseDTO> {
    return this.http.put<UserResponseDTO>(`${this.apiUrl}/${id}`, utente);
  }

  // Rimuove fisicamente l'entità dal database tramite DELETE.
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
