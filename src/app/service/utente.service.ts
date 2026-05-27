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

  getAll(): Observable<UserResponseDTO[]> {
    return this.http.get<UserResponseDTO[]>(this.apiUrl);
  }

  getById(id: string): Observable<UserResponseDTO> {
    return this.http.get<UserResponseDTO>(`${this.apiUrl}/${id}`);
  }

  create(utente: UserResponseDTO): Observable<UserResponseDTO> {
    return this.http.post<UserResponseDTO>(this.apiUrl, utente);
  }

  update(id: string, utente: UserResponseDTO): Observable<UserResponseDTO> {
    return this.http.put<UserResponseDTO>(`${this.apiUrl}/${id}`, utente);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
