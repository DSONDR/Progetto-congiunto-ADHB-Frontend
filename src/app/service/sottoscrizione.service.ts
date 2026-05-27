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
 * - disdici -> POST [Backend: SottoscrizioneController]
 */

@Injectable({
  providedIn: 'root'
})
export class SottoscrizioneService {
  private apiUrl = 'http://localhost:8080/api/sottoscrizioni';

  constructor(private http: HttpClient) {}

  getAbbonamentiAtleta(cf: string): Observable<Abbonamento[]> {
    return this.http.get<Abbonamento[]>(`${this.apiUrl}/abbonamenti/${cf}`);
  }

  getAll(): Observable<SottoscrizioneResponseDTO[]> {
    return this.http.get<SottoscrizioneResponseDTO[]>(this.apiUrl);
  }

  getById(id: number): Observable<SottoscrizioneResponseDTO> {
    return this.http.get<SottoscrizioneResponseDTO>(`${this.apiUrl}/${id}`);
  }

  create(sottoscrizione: SottoscrizioneResponseDTO): Observable<SottoscrizioneResponseDTO> {
    return this.http.post<SottoscrizioneResponseDTO>(this.apiUrl, sottoscrizione);
  }

  update(id: number, sottoscrizione: SottoscrizioneResponseDTO): Observable<SottoscrizioneResponseDTO> {
    return this.http.put<SottoscrizioneResponseDTO>(`${this.apiUrl}/${id}`, sottoscrizione);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getStoricoUtente(cf: string): Observable<Sottoscrizione[]> {
    return this.http.get<Sottoscrizione[]>(`${this.apiUrl}/storicoUtente/${cf}`);
  }

  sottoscrivi(request: any): Observable<SottoscrizioneResponseDTO> {
    return this.http.post<SottoscrizioneResponseDTO>(`${this.apiUrl}/sottoscrivi`, request);
  }

  rinnova(numeroAbb: number, metodo: string): Observable<Abbonamento> {
    return this.http.post<Abbonamento>(`${this.apiUrl}/rinnova/${numeroAbb}?metodo=${metodo}`, {});
  }

  disdici(numeroAbb: number): Observable<Abbonamento> {
    return this.http.post<Abbonamento>(`${this.apiUrl}/disdici/${numeroAbb}`, {});
  }
}
