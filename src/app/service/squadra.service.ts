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

  getAll(): Observable<SquadraResponseDTO[]> {
    return this.http.get<SquadraResponseDTO[]>(this.apiUrl);
  }

  getById(id: number): Observable<SquadraResponseDTO> {
    return this.http.get<SquadraResponseDTO>(`${this.apiUrl}/${id}`);
  }

  create(squadra: SquadraResponseDTO): Observable<SquadraResponseDTO> {
    return this.http.post<SquadraResponseDTO>(this.apiUrl, squadra);
  }

  update(id: number, squadra: SquadraResponseDTO): Observable<SquadraResponseDTO> {
    return this.http.put<SquadraResponseDTO>(`${this.apiUrl}/${id}`, squadra);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getByAllenatore(cf: string): Observable<SquadraResponseDTO[]> {
    return this.http.get<SquadraResponseDTO[]>(`${this.apiUrl}/per-allenatore/${cf}`);
  }

  getByAtleta(cf: string): Observable<SquadraResponseDTO[]> {
    return this.http.get<SquadraResponseDTO[]>(`${this.apiUrl}/per-atleta/${cf}`);
  }
  
  //Metodo per la relazione N:M
  addAtletaToSquadra(idSquadra: number, cfAtleta: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${idSquadra}/atleti/${cfAtleta}`, {});
  }

  rimuoviAtletaDaSquadra(idSquadra: number, cfAtleta: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idSquadra}/atleti/${cfAtleta}`);
  }

  getAtletiBySquadra(id: number): Observable<UserResponseDTO[]> {
    return this.http.get<UserResponseDTO[]>(`${this.apiUrl}/${id}/atleti`);
  }

  getAtletiScaduti(id: number): Observable<UserResponseDTO[]> {
    return this.http.get<UserResponseDTO[]>(`${this.apiUrl}/${id}/atleti/scaduti`);
}
}
