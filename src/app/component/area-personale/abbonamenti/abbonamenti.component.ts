import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../../service/session.service';
import { SottoscrizioneService } from '../../../service/sottoscrizione.service';
import { Abbonamento } from '../../../dto/response/abbonamento-response.dto';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-abbonamenti',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './abbonamenti.component.html',
  styleUrl: './abbonamenti.component.scss'
})
export class AbbonamentiComponent implements OnInit {
  
  /** Lista degli abbonamenti correntemente attivi o sospesi per l'utente loggato. */
  abbonamenti: Abbonamento[] = [];
  /** Storico degli abbonamenti scaduti o cancellati per l'utente loggato. */
  storicoAbbonamenti: Abbonamento[] = [];

  constructor(
    private session: SessionService,
    private sottoscrizioneService: SottoscrizioneService
  ) {}

  ngOnInit(): void {
    const utenteCorrente = this.session.getLoggedUser();
    if (utenteCorrente && utenteCorrente.cf) {
      this.sottoscrizioneService.getAbbonamentiAtleta(utenteCorrente.cf).subscribe({
        next: (data) => {
          // Filtriamo gli abbonamenti attivi e quelli scaduti/cancellati
          this.abbonamenti = data.filter(a => a.statoAbb === 'ATTIVO' || a.statoAbb === 'SOSPESO');
          this.storicoAbbonamenti = data.filter(a => a.statoAbb === 'SCADUTO' || a.statoAbb === 'CANCELLATO');
        },
        error: (err) => {
          console.error('Errore nel recupero degli abbonamenti:', err);
        }
      });
    }
  }

  /** Variabile booleana per mostrare/nascondere il pop-up dello storico. */
  isModalOpen: boolean = false;

  /** Azione temporanea mockata per rimandare alla sezione di acquisto abbonamenti. */
  nuovoAbbonamento() { alert('Vai alla pagina acquisti...'); }

  /**
   * Richiede conferma e invia al backend la richiesta di disdetta dell'abbonamento specificato.
   * Ricarica la lista degli abbonamenti in caso di successo.
   * 
   * @param numeroAbb l'ID dell'abbonamento da disdire
   */
  disdiciAbbonamento(numeroAbb: number) { 
    if(confirm('Sei sicuro di voler disdire questo abbonamento?')) {
      this.sottoscrizioneService.disdici(numeroAbb).subscribe({
        next: () => {
          alert('Abbonamento disdetto con successo!');
          this.ngOnInit(); // Ricarica gli abbonamenti
        },
        error: (err) => {
          console.error(err);
          alert('Errore durante la disdetta');
        }
      });
    }
  }
  
  /** Apre il pop-up contenente lo storico degli abbonamenti passati. */
  apriStorico() { this.isModalOpen = true; }

  /** Chiude il pop-up contenente lo storico. */
  chiudiStorico() { this.isModalOpen = false; }
}