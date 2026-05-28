import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SessionService } from '../../../service/session.service';
import { SottoscrizioneService } from '../../../service/sottoscrizione.service';
import { Abbonamento } from '../../../dto/response/abbonamento-response.dto';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-abbonamenti',
  standalone: true,
  imports: [CommonModule, RouterLink],
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
  ) { }

  ngOnInit(): void {
    const utenteCorrente = this.session.getLoggedUser();
    // Verifica che l'utente sia loggato e i dati siano presenti prima di procedere
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


  /**
   * Richiede conferma e invoca la cancellazione fisica dell'abbonamento.
   * Chiamata da: abbonamenti.component.html (Tasto "Disdici")
   * 
   * @param abb Oggetto Abbonamento da cancellare (include i riferimenti per la chiave composta)
   */
  disdiciAbbonamento(abb: Abbonamento) {
    // Verifica che l'utente abbia confermato l'operazione prima di procedere
    if (confirm('Sei sicuro di voler disdire e rimuovere questo abbonamento dal database?')) {
      // Verifica che i parametri richiesti siano presenti e validi prima di procedere
      if (!abb.pagamento || !abb.atleta) {
        alert("Dati abbonamento incompleti per la cancellazione.");
        return;
      }
      this.sottoscrizioneService.delete(abb.numeroAbb, abb.pagamento.idPagamento, abb.atleta.cf).subscribe({
        next: () => {
          alert('Abbonamento disdetto e rimosso con successo!');
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