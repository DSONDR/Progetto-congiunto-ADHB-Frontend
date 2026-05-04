import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Istruttore } from '../dto/istruttore.model';

@Injectable({
  providedIn: 'root'
})
export class IstruttoreService {

  private apiUrl = '/api/istruttore';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Istruttore[]> {
    return this.http.get<Istruttore[]>(this.apiUrl);
  }

  getById(id: string): Observable<Istruttore> {
    return this.http.get<Istruttore>(`${this.apiUrl}/${id}`);
  }

  create(istruttore: Istruttore): Observable<Istruttore> {
    return this.http.post<Istruttore>(this.apiUrl, istruttore);
  }

  update(id: string, istruttore: Istruttore): Observable<Istruttore> {
    return this.http.put<Istruttore>(`${this.apiUrl}/${id}`, istruttore);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
