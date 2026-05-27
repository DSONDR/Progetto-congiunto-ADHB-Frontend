import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SessionService } from '../../../service/session.service';
import { AssistenzaService } from '../../../service/assistenza.service';
import { AssistenzaResponseDTO } from '../../../dto/response/assistenza-response.dto';
import { AssistenzaRequestDTO } from '../../../dto/request/assistenza-request.dto';
import { OnInit } from '@angular/core';

interface TicketEsteso extends AssistenzaResponseDTO {
  isExpanded?: boolean;
  votoForm?: number;
}

@Component({
  selector: 'app-assistenza',
  standalone: true,
  imports: [CommonModule, FormsModule], // Necessario per ngIf, ngFor e form
  templateUrl: './assistenza.component.html',
  styleUrl: './assistenza.component.scss'
})
export class AssistenzaComponent implements OnInit {
  
  /** Lista dei ticket aperti o in lavorazione creati dall'utente. */
  richiesteAperte: TicketEsteso[] = [];
  /** Lista dei ticket risolti o chiusi (storico) dell'utente. */
  richiesteChiuse: TicketEsteso[] = [];
  /** Flag per gestire la visualizzazione o meno dello storico dei ticket. */
  mostraStorico: boolean = false;
  /** Flag per aprire e chiudere il modale di inserimento nuovo ticket. */
  isModalOpen: boolean = false;
  /** Dati bindati al form di creazione nuova richiesta. */
  nuovaRichiestaData: AssistenzaRequestDTO = {
    oggetto: '',
    tipoAss: '',
    utenteCf: '',
    contenuto: ''
  };

  constructor(
    private session: SessionService,
    private assistenzaService: AssistenzaService
  ) {}

  ngOnInit(): void {
    this.caricaRichieste();
  }

  /**
   * Recupera tramite chiamata API l'elenco dei ticket dell'utente attualmente loggato.
   * Smista automaticamente i ticket in due array: `richiestePendenti` e `richiesteChiuse`
   * a seconda del loro `stato`. Aggiunge ad ogni ticket un flag `isExpanded` per l'accordion UI.
   */
  caricaRichieste() {
    const utenteCorrente = this.session.getLoggedUser();
    if (utenteCorrente && utenteCorrente.cf) {
      this.assistenzaService.getByUtente(utenteCorrente.cf).subscribe({
        next: (data) => {
          this.richiesteAperte = data
            .filter(ticket => ticket.stato !== 'RISOLTO' && ticket.stato !== 'CHIUSO')
            .map(ticket => ({ ...ticket, isExpanded: false }));
            
          this.richiesteChiuse = data
            .filter(ticket => ticket.stato === 'RISOLTO' || ticket.stato === 'CHIUSO')
            .map(ticket => ({ ...ticket, isExpanded: false, votoForm: 5 }));
        },
        error: (err) => console.error('Errore recupero ticket:', err)
      });
    }
  }

  /**
   * Inverte lo stato di espansione (visualizzazione dei dettagli) del ticket passato come parametro.
   * Utilizzato nel template HTML per creare un effetto accordion visivo sui ticket pendenti.
   * 
   * @param ticket Il ticket da espandere/collassare
   */
  toggleTicket(ticket: TicketEsteso) {
    ticket.isExpanded = !ticket.isExpanded;
  }

  /** Apre la modale per l'inserimento di una nuova richiesta. */
  apriNuovaRichiesta() { this.isModalOpen = true; }

  /** Chiude la modale della nuova richiesta senza inviare nulla. */
  chiudiNuovaRichiesta() { this.isModalOpen = false; }

  /**
   * Genera il payload aggiungendoci il CF dell'utente loggato, quindi invia
   * la nuova richiesta di assistenza (`apriTicket()`) tramite l'`AssistenzaService`.
   * Se l'invio ha esito positivo, mostra un alert, chiude la modale, resetta i campi
   * e ricarica i dati per aggiornare la visualizzazione.
   */
  inviaRichiesta() {
    const utenteCorrente = this.session.getLoggedUser();
    if (utenteCorrente && utenteCorrente.cf) {
      this.nuovaRichiestaData.utenteCf = utenteCorrente.cf;
      this.assistenzaService.apriTicket(this.nuovaRichiestaData).subscribe({
        next: () => {
          alert('Richiesta inviata con successo!');
          this.chiudiNuovaRichiesta();
          this.caricaRichieste(); // Ricarica la lista
          this.nuovaRichiestaData = { oggetto: '', tipoAss: '', utenteCf: '', contenuto: '' };
        },
        error: (err) => alert('Errore invio richiesta.')
      });
    }
  }

  /**
   * Permette di alternare la visualizzazione o il nascondimento 
   * dei ticket passati/risolti (Storico).
   */
  recuperaRichiesta() {
    this.mostraStorico = !this.mostraStorico;
  }

  /** Invia la valutazione per un ticket in stato RISOLTO e lo chiude. */
  valutaRichiesta(ticket: TicketEsteso) { 
    if (!ticket.votoForm || ticket.votoForm < 1 || ticket.votoForm > 5) {
      alert('Seleziona un voto valido (1-5).');
      return;
    }
    
    if (ticket.idTicket !== undefined) {
      this.assistenzaService.valutaTicket(ticket.idTicket, ticket.votoForm).subscribe({
        next: () => {
          alert('Grazie per la tua valutazione!');
          this.caricaRichieste(); // Ricarica per spostare/aggiornare lo stato
        },
        error: (err) => alert('Errore invio valutazione: ' + (err.error?.message || err.error || ''))
      });
    }
  }
}