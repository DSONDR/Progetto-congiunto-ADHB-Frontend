import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * iscrizione.service.ts
 * Mapping API Backend invocati:
 * - iscriviSingola -> POST [Backend: IscrizioneController]
 * - usaAbbonamento -> POST [Backend: IscrizioneController]
 * - cancellaIscrizione -> DELETE [Backend: IscrizioneController]
 * - getStoricoUtente -> GET [Backend: IscrizioneController]
 * - getStoricoUsiAbbonamentoUtente -> GET [Backend: IscrizioneController]
 * - getIscrittiByAttivita -> GET [Backend: IscrizioneController]
 */
import { UserResponseDTO } from '../dto/response/user-response.dto';
import { IscrizioneRequest, UsaAbbonamentoRequest } from '../dto/request/iscrizioni-request.dto';

@Injectable({
  providedIn: 'root'
})
export class IscrizioneService {
  private apiUrl = '/api/iscrizioni';

  constructor(private http: HttpClient) {}

  // Esegue l'operazione di iscriviSingola comunicando con il backend.
  iscriviSingola(request: IscrizioneRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/iscrivi`, request);
  }

  // Esegue l'operazione di usaAbbonamento comunicando con il backend.
  usaAbbonamento(request: UsaAbbonamentoRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/usa-abbonamento`, request);
  }

  // Esegue l'operazione di cancellaIscrizione comunicando con il backend.
  cancellaIscrizione(codiceAtt: number, idPagamento: number, cf: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${codiceAtt}/${idPagamento}/${cf}`);
  }

  // Esegue l'operazione di getStoricoUtente comunicando con il backend.
  getStoricoUtente(cf: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/utente/${cf}`);
  }

  // Esegue l'operazione di getStoricoUsiAbbonamentoUtente comunicando con il backend.
  getStoricoUsiAbbonamentoUtente(cf: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usi-abbonamento/utente/${cf}`);
  }

  // Esegue l'operazione di getIscrittiByAttivita comunicando con il backend.
  getIscrittiByAttivita(idAttivita: number): Observable<UserResponseDTO[]> {
    return this.http.get<UserResponseDTO[]>(`${this.apiUrl}/attivita/${idAttivita}`);
  }
}
