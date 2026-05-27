import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../../service/session.service';
import { UserResponseDTO } from '../../../dto/response/user-response.dto';
import { CertificatoMedicoService, CertificatoMedico } from '../../../service/certificato-medico.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-benvenuto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './benvenuto.component.html',
  styleUrl: './benvenuto.component.scss'
})
export class BenvenutoComponent implements OnInit {

  /** L'utente attualmente loggato recuperato dalla sessione. */
  utenteCorrente: UserResponseDTO | null = null;
  /** Indica se il certificato medico dell'utente è scaduto rispetto alla data odierna. */
  certificatoScaduto: boolean = false;
  /** Indica se l'utente non ha mai caricato un certificato. */
  certificatoAssente: boolean = false;

  /** Flag per gestire l'apertura e la chiusura della modale di caricamento certificato. */
  isModaleAperta: boolean = false;
  /** Dati bindati al form di inserimento del nuovo certificato medico. */
  nuovoCertificato = {
    tipo: '',
    dataEmissione: '',
    dataScadenza: '',
    medicoRiferimento: ''
  };

  constructor(
    private sessionService: SessionService,
    private certService: CertificatoMedicoService
  ) {}

  ngOnInit() {
    this.utenteCorrente = this.sessionService.getLoggedUser();
    this.verificaCertificato();
  }

  /**
   * Controlla la scadenza del certificato medico dell'utente corrente.
   * Imposta i flag `certificatoAssente` e `certificatoScaduto` per il controllo visivo.
   */
  verificaCertificato() {
    if (!this.utenteCorrente?.scadenzaCertificato) {
      this.certificatoAssente = true;
      return;
    }
    
    // LocalDate restituisce la data nel formato YYYY-MM-DD
    const dataScadenza = new Date(this.utenteCorrente.scadenzaCertificato);
    const oggi = new Date();
    
    this.certificatoScaduto = dataScadenza < oggi;
  }

  /** Apre la modale per l'inserimento di un nuovo certificato. */
  apriModaleCertificato() {
    this.isModaleAperta = true;
  }

  /** Chiude la modale e resetta i campi del form. */
  chiudiModaleCertificato() {
    this.isModaleAperta = false;
    this.nuovoCertificato = {
      tipo: '',
      dataEmissione: '',
      dataScadenza: '',
      medicoRiferimento: ''
    };
  }

  /**
   * Valida i campi del form per il nuovo certificato e invia la richiesta al backend.
   * Se ha successo, aggiorna i dati dell'utente in sessione con la nuova data di scadenza.
   */
  salvaCertificato() {
    if (!this.utenteCorrente) return;
    
    // Validazione base
    if (!this.nuovoCertificato.tipo || !this.nuovoCertificato.dataEmissione || !this.nuovoCertificato.dataScadenza || !this.nuovoCertificato.medicoRiferimento) {
      alert("Tutti i campi sono obbligatori");
      return;
    }

    const request: CertificatoMedico = {
      tipo: this.nuovoCertificato.tipo,
      dataEmissione: this.nuovoCertificato.dataEmissione,
      dataScadenza: this.nuovoCertificato.dataScadenza,
      medicoRiferimento: this.nuovoCertificato.medicoRiferimento,
      utente: { cf: this.utenteCorrente.cf }
    };

    this.certService.create(request).subscribe({
      next: (res) => {
        alert("Certificato salvato con successo!");
        this.chiudiModaleCertificato();
        // Aggiorniamo la sessione o ricarichiamo (mock: aggiorna solo frontend)
        this.utenteCorrente!.scadenzaCertificato = res.dataScadenza;
        this.sessionService.setLoggedUser(this.utenteCorrente!);
        this.verificaCertificato();
      },
      error: (err) => {
        alert("Errore durante il salvataggio del certificato");
        console.error(err);
      }
    });
  }
}