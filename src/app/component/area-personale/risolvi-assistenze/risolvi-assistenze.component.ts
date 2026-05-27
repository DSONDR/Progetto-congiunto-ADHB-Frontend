import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../../service/session.service';
import { AssistenzaService } from '../../../service/assistenza.service';
import { AssistenzaResponseDTO } from '../../../dto/response/assistenza-response.dto';

@Component({
  selector: 'app-risolvi-assistenze',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './risolvi-assistenze.component.html',
  styleUrl: './risolvi-assistenze.component.scss'
})
export class RisolviAssistenzeComponent implements OnInit {
  
  /** Lista dei ticket attualmente aperti e non ancora presi in carico da nessun operatore. */
  richiesteAperte: AssistenzaResponseDTO[] = [];
  /** Lista dei ticket che l'operatore attualmente loggato ha preso in carico e sta gestendo. */
  richiesteInCarico: AssistenzaResponseDTO[] = [];
  /** Storico dei ticket risolti o chiusi dall'operatore attualmente loggato. */
  richiesteCompletate: AssistenzaResponseDTO[] = [];

  constructor(private session: SessionService, private assistenzaService: AssistenzaService) {}

  ngOnInit() {
    this.caricaDati();
  }

  /**
   * Recupera tutti i ticket a sistema e li smista in tre array differenti
   * (`richiesteInAttesa`, `richiesteInCarico`, `richiesteCompletate`)
   * applicando filtri basati sullo stato del ticket e sull'ID dell'assistente.
   */
  caricaDati() {
    const user = this.session.getLoggedUser();
    if(user) {
      this.assistenzaService.getAll().subscribe({
        next: (res) => {
          this.richiesteAperte = res.filter(r => r.stato && r.stato.toUpperCase() === 'APERTO');
          this.richiesteInCarico = res.filter(r => r.stato === 'IN LAVORAZIONE' && r.assistenteCf === user.cf);
          this.richiesteCompletate = res.filter(r => (r.stato === 'RISOLTO' || r.stato === 'CHIUSO') && r.assistenteCf === user.cf);
        },
        error: (err) => console.error(err)
      });
    }
  }

  /**
   * Associa il ticket all'operatore loggato cambiandone lo stato in 'IN LAVORAZIONE'.
   *
   * @param req Il ticket da prendere in carico
   */
  prendiInCarico(req: AssistenzaResponseDTO): void {
    const user = this.session.getLoggedUser();
    if(user) {
      this.assistenzaService.prendiInCarico(req.idTicket, user.cf).subscribe(() => {
        alert("Hai preso in carico la richiesta!");
        this.caricaDati();
      });
    }
  }

  /**
   * Apre un prompt per permettere all'admin/istruttore di digitare la soluzione,
   * dopodiché invia l'aggiornamento al backend cambiando lo stato in 'RISOLTO'.
   *
   * @param req Il ticket da risolvere
   */
  risolviTicket(req: AssistenzaResponseDTO): void {
    const risposta = prompt("Inserisci la risposta alla richiesta:");
    if(risposta !== null && risposta.trim() !== "") {
      this.assistenzaService.risolviTicket(req.idTicket, risposta).subscribe(() => {
        alert("Richiesta risolta con successo!");
        this.caricaDati();
      });
    }
  }
}