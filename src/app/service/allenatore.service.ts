import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Allenatore } from '../dto/allenatore.model';

@Injectable({
  providedIn: 'root'
})
export class AllenatoreService {

  private apiUrl = '/api/allenatore';

  constructor(private http: HttpClient) {}
	
  //CRUD per id univoco
  getAll(): Observable<Allenatore[]> {
    return this.http.get<Allenatore[]>(this.apiUrl);
  }

  getById(id: string): Observable<Allenatore> {
    return this.http.get<Allenatore>(`${this.apiUrl}/${id}`);
  }

  create(allenatore: Allenatore): Observable<Allenatore> {
    return this.http.post<Allenatore>(this.apiUrl, allenatore);
  }

  update(id: string, allenatore: Allenatore): Observable<Allenatore> {
    return this.http.put<Allenatore>(`${this.apiUrl}/${id}`, allenatore);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
  //Ricerca allenatore per grado
  getByGrado(grado: number): Observable<Allenatore[]> {
    const params = new HttpParams()
    .set('grado', grado.toString());
    return this.http.get<Allenatore[]>(`${this.apiUrl}/search`,{params});
  }
  
  //Ricerca allenatore tra due gradi
  getByGradoBetween(min: number, max: number): Observable<Allenatore[]> {
    const params = new HttpParams()
      .set('min', min.toString())
      .set('max', max.toString());
    return this.http.get<Allenatore[]>(`${this.apiUrl}/filter`,{params});
  }  	
}
