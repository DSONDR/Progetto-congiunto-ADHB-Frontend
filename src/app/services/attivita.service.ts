import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Attivita } from '../models/attivita.model';

@Injectable({
  providedIn: 'root'
})
export class AttivitaService {
  private apiUrl = '/api/attivita';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Attivita[]> {
    return this.http.get<Attivita[]>(this.apiUrl);
  }

  getById(id: number): Observable<Attivita> {
    return this.http.get<Attivita>(`${this.apiUrl}/${id}`);
  }

  create(attivita: Attivita): Observable<Attivita> {
    return this.http.post<Attivita>(this.apiUrl, attivita);
  }

  update(id: number, attivita: Attivita): Observable<Attivita> {
    return this.http.put<Attivita>(`${this.apiUrl}/${id}`, attivita);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  filtra(params: { idImpianto?: number; prezzo?: number; target?: string; tipoEvento?: string; }): Observable<Attivita[]> {
    let httpParams = new HttpParams();
    if (params.idImpianto != null) {
      httpParams = httpParams.set('idImpianto', params.idImpianto.toString());
    }
    if (params.prezzo != null) {
      httpParams = httpParams.set('prezzo', params.prezzo.toString());
    }
    if (params.target) {
      httpParams = httpParams.set('target', params.target);
    }
    if (params.tipoEvento) {
      httpParams = httpParams.set('tipoEvento', params.tipoEvento);
    }
    return this.http.get<Attivita[]>(`${this.apiUrl}/filtra`, { params: httpParams });
  }
}
