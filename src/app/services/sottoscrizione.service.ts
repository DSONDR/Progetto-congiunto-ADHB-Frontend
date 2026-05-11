import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sottoscrizione } from '../models/sottoscrizione.model';

@Injectable({
  providedIn: 'root'
})
export class SottoscrizioneService {
  private apiUrl = '/api/sottoscrizioni';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Sottoscrizione[]> {
    return this.http.get<Sottoscrizione[]>(this.apiUrl);
  }

  getById(id: number): Observable<Sottoscrizione> {
    return this.http.get<Sottoscrizione>(`${this.apiUrl}/${id}`);
  }

  create(sottoscrizione: Sottoscrizione): Observable<Sottoscrizione> {
    return this.http.post<Sottoscrizione>(this.apiUrl, sottoscrizione);
  }

  update(id: number, sottoscrizione: Sottoscrizione): Observable<Sottoscrizione> {
    return this.http.put<Sottoscrizione>(`${this.apiUrl}/${id}`, sottoscrizione);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
