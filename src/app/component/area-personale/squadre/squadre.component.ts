import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Abilita le direttive base come ngIf e ngFor
import { RouterLink } from '@angular/router'; // Abilita la navigazione tramite link cliccabili
import { SessionService } from '../../../service/session.service';
import { SquadraService } from '../../../service/squadra.service';
import { AttivitaService } from '../../../service/attivita.service';
import { OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-squadre',
  standalone: true, // Componente autonomo che non richiede moduli esterni
  imports: [CommonModule, RouterLink], // Import dei moduli necessari alla vista
  templateUrl: './squadre.component.html',
  styleUrl: './squadre.component.scss'
})
export class SquadreComponent implements OnInit {

  /** Ruolo dell'utente loggato (es. 'atleta', 'allenatore'). Condiziona la visualizzazione e il tipo di chiamata API. */
  ruoloUtente: string = 'atleta';
  /** Lista delle squadre di appartenenza (se atleta) o allenate (se allenatore) recuperate dal backend. */
  squadreMembri: any[] = [];

  /** Array temporaneo per simulare le prossime partite visibili a schermo. */
  prossimePartite: any[] = [];

  // Variabili di stato per la gestione della finestra pop-up (Modal)
  isRosterModalOpen: boolean = false; // Controlla la visibilità del pop-up (aperto/chiuso)
  squadraSelezionataNome: string = ''; // Stringa che memorizza il titolo della squadra cliccata
  rosterCorrente: any[] = []; // Array temporaneo che conterrà i giocatori da mostrare nella tabella


  constructor(
    private sessionService: SessionService, 
    private squadraService: SquadraService,
    private attivitaService: AttivitaService
  ) { }

  // Eseguito all'avvio del componente, inizializza i dati o carica le risorse necessarie.
  ngOnInit() {
    const user = this.sessionService.getLoggedUser();
    // Verifica che l'utente sia loggato e i dati siano presenti prima di procedere
    if (user) {
      this.ruoloUtente = user.tipoIscritto.toLowerCase();
      // Verifica che il valore corrisponda a quello atteso prima di procedere
      if (this.ruoloUtente === 'atleta') {
        this.squadraService.getByAtleta(user.cf).subscribe(res => {
          this.squadreMembri = res;
          this.caricaProssimePartite();
        });
      } else if (this.ruoloUtente === 'allenatore') {
        this.squadraService.getByAllenatore(user.cf).subscribe(res => {
          this.squadreMembri = res;
          this.caricaProssimePartite();
        });
      }
    }
  }

  // Gestisce la logica di caricaProssimePartite nel componente.
  caricaProssimePartite() {
    // Verifica che i parametri richiesti siano presenti e validi prima di procedere
    if(this.squadreMembri.length > 0) {
      const requests = this.squadreMembri.map(sq => this.attivitaService.filtra({ squadraId: sq.id, tipoEvento: 'Partita' }));
      forkJoin(requests).subscribe(results => {
        const tutte = results.flat();
        this.prossimePartite = Array.from(new Set(tutte.map(a => a.codiceAtt)))
          .map(id => tutte.find(a => a.codiceAtt === id));
      });
    }
  }

  /**
   * Apre la finestra modale contenente il roster (l'elenco dei compagni di squadra).
   * Effettua una chiamata al backend per recuperare i giocatori associati allo specifico `squadraId`.
   *
   * @param squadraId L'identificativo univoco della squadra da consultare
   * @param nomeSquadra Il nome della squadra
   * @param categoria La categoria della squadra
   */
  apriRoster(squadraId: number, nomeSquadra: string, categoria: string) {
    this.squadraSelezionataNome = `${nomeSquadra} (${categoria})`;  // Costruisce il titolo del pop-up
    this.squadraService.getAtletiBySquadra(squadraId).subscribe(res => {  // Prende il roster corrispondente dall'id
      this.rosterCorrente = res;
      this.isRosterModalOpen = true;  // Imposta la variabile a true per far apparire il pop-up nell'HTML
    });
  }

  /**
   * Chiude il pop-up del roster ripristinando la visibilità a false.
   */
  chiudiRoster() {
    this.isRosterModalOpen = false;
  }
}