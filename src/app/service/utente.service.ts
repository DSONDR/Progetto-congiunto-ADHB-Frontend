import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Utente } from '../dto/utente.model';	//Import dal DTO

@Injectable({
  providedIn: 'root'
})
export class UtenteService {

  private apiUrl = '/api/utente';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Utente[]> {
    return this.http.get<Utente[]>(this.apiUrl);
  }

  getById(id: string): Observable<Utente> {
    return this.http.get<Utente>(`${this.apiUrl}/${id}`);
  }

  create(utente: Utente): Observable<Utente> {
    return this.http.post<Utente>(this.apiUrl, utente);
  }

  update(id: string, utente: Utente): Observable<Utente> {
    return this.http.put<Utente>(`${this.apiUrl}/${id}`, utente);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
