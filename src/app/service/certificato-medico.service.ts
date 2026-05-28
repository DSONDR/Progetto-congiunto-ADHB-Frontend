import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * certificato-medico.service.ts
 * Mapping API Backend invocati:
 * - create -> POST [Backend: Certificato-medicoController]
 * - getByUtenteCf -> GET [Backend: Certificato-medicoController]
 */

export interface CertificatoMedico {
    id?: number;
    tipo: string;
    dataEmissione: string;
    dataScadenza: string;
    medicoRiferimento: string;
    utente: { cf: string };
}

@Injectable({
  providedIn: 'root'
})
export class CertificatoMedicoService {
  private apiUrl = 'http://localhost:8080/api/certificati-medici';

  constructor(private http: HttpClient) {}

  // Invia al backend i dati per creare una nuova entità.
  create(certificato: CertificatoMedico): Observable<CertificatoMedico> {
    return this.http.post<CertificatoMedico>(this.apiUrl, certificato);
  }

  // Esegue l'operazione di getByUtenteCf comunicando con il backend.
  getByUtenteCf(cf: string): Observable<CertificatoMedico[]> {
    return this.http.get<CertificatoMedico[]>(`${this.apiUrl}/search?cf=${cf}`);
  }
}
