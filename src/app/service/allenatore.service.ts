import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserResponseDTO } from '../dto/response/user-response.dto';

/**
 * allenatore.service.ts
 * Mapping API Backend invocati:
 * - getAll -> GET [Backend: AllenatoreController]
 * - getById -> GET [Backend: AllenatoreController]
 * - create -> POST [Backend: AllenatoreController]
 * - update -> PUT [Backend: AllenatoreController]
 * - delete -> DELETE [Backend: AllenatoreController]
 * - getByGrado -> GET [Backend: AllenatoreController]
 * - getByGradoBetween -> GET [Backend: AllenatoreController]
 */

@Injectable({
  providedIn: 'root'
})
export class AllenatoreService {

  private apiUrl = '/api/allenatori';

  constructor(private http: HttpClient) {}
	
  // Recupera tutti gli allenatori registrati a sistema. Utilizzato in gestione-utenti
  getAll(): Observable<UserResponseDTO[]> {
    return this.http.get<UserResponseDTO[]>(this.apiUrl);
  }

  // Recupera i dettagli di un singolo allenatore. Utilizzato in gestione-utenti
  getById(id: string): Observable<UserResponseDTO> {
    return this.http.get<UserResponseDTO>(`${this.apiUrl}/${id}`);
  }

  // Crea un nuovo account allenatore. Utilizzato in registrazione e gestione-utenti
  create(allenatore: UserResponseDTO): Observable<UserResponseDTO> {
    return this.http.post<UserResponseDTO>(this.apiUrl, allenatore);
  }

  // Aggiorna i dati anagrafici o di grado di un allenatore. Utilizzato in gestione-utenti
  update(id: string, allenatore: UserResponseDTO): Observable<UserResponseDTO> {
    return this.http.put<UserResponseDTO>(`${this.apiUrl}/${id}`, allenatore);
  }

  // Elimina definitivamente un allenatore dal sistema. Utilizzato in gestione-utenti
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
  // Ricerca gli allenatori con un grado specifico. Utilizzato nei filtri di gestione-utenti
  getByGrado(grado: number): Observable<UserResponseDTO[]> {
    const params = new HttpParams()
    .set('grado', grado.toString());
    return this.http.get<UserResponseDTO[]>(`${this.apiUrl}/search`,{params});
  }
  
  // Ricerca gli allenatori il cui grado è compreso in un range. Utilizzato nei filtri di gestione-utenti
  getByGradoBetween(min: number, max: number): Observable<UserResponseDTO[]> {
    const params = new HttpParams()
      .set('min', min.toString())
      .set('max', max.toString());
    return this.http.get<UserResponseDTO[]>(`${this.apiUrl}/filter`,{params});
  }  	
}
