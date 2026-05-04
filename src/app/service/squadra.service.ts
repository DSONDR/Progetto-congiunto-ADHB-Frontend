import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Atleta } from '../dto/atleta.model';
import { Squadra } from '../dto/squadra.model';

@Injectable({
  providedIn: 'root'
})
export class SquadraService {
  private apiUrl = 'http://localhost:8080/api/squadre';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Squadra[]> {
    return this.http.get<Squadra[]>(this.apiUrl);
  }

  getById(id: number): Observable<Squadra> {
    return this.http.get<Squadra>(`${this.apiUrl}/${id}`);
  }

  create(squadra: Squadra): Observable<Squadra> {
    return this.http.post<Squadra>(this.apiUrl, squadra);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getByAllenatore(cf: string): Observable<Squadra[]> {
    return this.http.get<Squadra[]>(`${this.apiUrl}/per-allenatore/${cf}`);
  }

  getByAtleta(cf: string): Observable<Squadra[]> {
    return this.http.get<Squadra[]>(`${this.apiUrl}/per-atleta/${cf}`);
  }
  
  //Metodo per la relazione N:M
  addAtletaToSquadra(idSquadra: number, cfAtleta: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${idSquadra}/atleti/${cfAtleta}`, {});
  }

  getAtletiBySquadra(id: number): Observable<Atleta[]> {
    return this.http.get<Atleta[]>(`${this.apiUrl}/${id}/atleti`);
  }

  getAtletiScaduti(id: number): Observable<Atleta[]> {
    return this.http.get<Atleta[]>(`${this.apiUrl}/${id}/atleti/scaduti`);
}
}
