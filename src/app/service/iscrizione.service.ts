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

export interface IscrizioneRequestDTO {
  atletaCf: string;
  attivitaId: number;
  importo: number;
  metodo: string;
}

export interface UsaAbbonamentoRequestDTO {
  atletaCf: string;
  attivitaId: number;
  abbonamentoId: number;
}

@Injectable({
  providedIn: 'root'
})
export class IscrizioneService {
  private apiUrl = '/api/iscrizioni';

  constructor(private http: HttpClient) {}

  iscriviSingola(request: IscrizioneRequestDTO): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/iscrivi`, request);
  }

  usaAbbonamento(request: UsaAbbonamentoRequestDTO): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/usa-abbonamento`, request);
  }

  cancellaIscrizione(codiceAtt: number, idPagamento: number, cf: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${codiceAtt}/${idPagamento}/${cf}`);
  }

  getStoricoUtente(cf: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/utente/${cf}`);
  }

  getStoricoUsiAbbonamentoUtente(cf: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usi-abbonamento/utente/${cf}`);
  }

  getIscrittiByAttivita(idAttivita: number): Observable<UserResponseDTO[]> {
    return this.http.get<UserResponseDTO[]>(`${this.apiUrl}/attivita/${idAttivita}`);
  }
}
