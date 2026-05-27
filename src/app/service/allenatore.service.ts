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
	
  //CRUD per id univoco
  getAll(): Observable<UserResponseDTO[]> {
    return this.http.get<UserResponseDTO[]>(this.apiUrl);
  }

  getById(id: string): Observable<UserResponseDTO> {
    return this.http.get<UserResponseDTO>(`${this.apiUrl}/${id}`);
  }

  create(allenatore: UserResponseDTO): Observable<UserResponseDTO> {
    return this.http.post<UserResponseDTO>(this.apiUrl, allenatore);
  }

  update(id: string, allenatore: UserResponseDTO): Observable<UserResponseDTO> {
    return this.http.put<UserResponseDTO>(`${this.apiUrl}/${id}`, allenatore);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
  //Ricerca allenatore per grado
  getByGrado(grado: number): Observable<UserResponseDTO[]> {
    const params = new HttpParams()
    .set('grado', grado.toString());
    return this.http.get<UserResponseDTO[]>(`${this.apiUrl}/search`,{params});
  }
  
  //Ricerca allenatore tra due gradi
  getByGradoBetween(min: number, max: number): Observable<UserResponseDTO[]> {
    const params = new HttpParams()
      .set('min', min.toString())
      .set('max', max.toString());
    return this.http.get<UserResponseDTO[]>(`${this.apiUrl}/filter`,{params});
  }  	
}
