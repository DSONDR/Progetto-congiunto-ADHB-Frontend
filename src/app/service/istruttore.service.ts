// Import Angular e RxJS
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// DTO utilizzato nel service
import { UserResponseDTO } from '../dto/response/user-response.dto';

/**
 * istruttore.service.ts
 * Mapping API Backend invocati:
 * - getAll -> GET [Backend: IstruttoreController]
 * - getById -> GET [Backend: IstruttoreController]
 * - create -> POST [Backend: IstruttoreController]
 * - update -> PUT [Backend: IstruttoreController]
 * - delete -> DELETE [Backend: IstruttoreController]
 * - getAttivita -> GET [Backend: IstruttoreController]
 */

@Injectable({
  providedIn: 'root'
})
export class IstruttoreService {

  private apiUrl = '/api/istruttori';

  // Iniezione HttpClient
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
  create(istruttore: UserResponseDTO): Observable<UserResponseDTO> {
    return this.http.post<UserResponseDTO>(this.apiUrl, istruttore);
  }

  // Invia al backend i dati per aggiornare un'entità esistente.
  update(id: string, istruttore: UserResponseDTO): Observable<UserResponseDTO> {
    return this.http.put<UserResponseDTO>(`${this.apiUrl}/${id}`, istruttore);
  }

  // Rimuove fisicamente l'entità dal database tramite DELETE.
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Recupera attività associate all’istruttore
  getAttivita(cf: string): Observable<any[]> {
    return this.http.get<any[]>(`/api/istruttori/${cf}/attivita`);
  }
}
