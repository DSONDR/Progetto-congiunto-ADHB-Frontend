import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserResponseDTO } from '../dto/response/user-response.dto';

/**
 * atleta.service.ts
 * Mapping API Backend invocati:
 * - getAll -> GET [Backend: AtletaController]
 * - getById -> GET [Backend: AtletaController]
 * - create -> POST [Backend: AtletaController]
 * - update -> PUT [Backend: AtletaController]
 * - delete -> DELETE [Backend: AtletaController]
 * - spendiPunti -> POST [Backend: AtletaController]
 */

@Injectable({
  providedIn: 'root'
})
export class AtletaService {

  private apiUrl = '/api/atleti';

  constructor(private http: HttpClient) {}

  // Legge tutti gli atleti
  getAll(): Observable<UserResponseDTO[]> {
    return this.http.get<UserResponseDTO[]>(this.apiUrl);
  }

  // Legge un singolo atleta tramite CF
  getById(id: string): Observable<UserResponseDTO> {
    return this.http.get<UserResponseDTO>(`${this.apiUrl}/${id}`);
  }

  // Crea un nuovo atleta
  create(atleta: UserResponseDTO): Observable<UserResponseDTO> {
    return this.http.post<UserResponseDTO>(this.apiUrl, atleta);
  }

  // Aggiorna un atleta esistente
  update(id: string, atleta: UserResponseDTO): Observable<UserResponseDTO> {
    return this.http.put<UserResponseDTO>(`${this.apiUrl}/${id}`, atleta);
  }

  // Elimina un atleta
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Spende i punti gamification (Fase 5)
  spendiPunti(cf: string, punti: number): Observable<UserResponseDTO> {
    return this.http.post<UserResponseDTO>(`${this.apiUrl}/${cf}/spendi-punti?punti=${punti}`, {});
  }
}
