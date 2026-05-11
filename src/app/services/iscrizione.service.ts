import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Iscrizione } from '../models/iscrizione.model';

@Injectable({
  providedIn: 'root'
})
export class IscrizioneService {
  private apiUrl = '/api/iscrizioni';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Iscrizione[]> {
    return this.http.get<Iscrizione[]>(this.apiUrl);
  }

  getById(id: number): Observable<Iscrizione> {
    return this.http.get<Iscrizione>(`${this.apiUrl}/${id}`);
  }

  create(iscrizione: Iscrizione): Observable<Iscrizione> {
    return this.http.post<Iscrizione>(this.apiUrl, iscrizione);
  }

  update(id: number, iscrizione: Iscrizione): Observable<Iscrizione> {
    return this.http.put<Iscrizione>(`${this.apiUrl}/${id}`, iscrizione);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
