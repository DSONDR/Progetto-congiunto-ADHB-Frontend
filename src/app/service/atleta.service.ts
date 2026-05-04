import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Atleta } from '../dto/atleta.model';

@Injectable({
  providedIn: 'root'
})
export class AtletaService {

  private apiUrl = '/api/atleti';

  constructor(private http: HttpClient) {}

  // Legge tutti gli atleti
  getAll(): Observable<Atleta[]> {
    return this.http.get<Atleta[]>(this.apiUrl);
  }

  // Legge un singolo atleta tramite CF
  getById(id: string): Observable<Atleta> {
    return this.http.get<Atleta>(`${this.apiUrl}/${id}`);
  }

  // Crea un nuovo atleta
  create(atleta: Atleta): Observable<Atleta> {
    return this.http.post<Atleta>(this.apiUrl, atleta);
  }

  // Aggiorna un atleta esistente
  update(id: string, atleta: Atleta): Observable<Atleta> {
    return this.http.put<Atleta>(`${this.apiUrl}/${id}`, atleta);
  }

  // Elimina un atleta
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
