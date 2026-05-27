import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SessionService } from '../../service/session.service';
import { AttivitaService } from '../../service/attivita.service';
import { ImpiantoService, Impianto } from '../../service/impianto.service';
import { IscrizioneService } from '../../service/iscrizione.service';
import { SottoscrizioneService } from '../../service/sottoscrizione.service';

@Component({
  selector: 'app-eventi',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './eventi.component.html',
  styleUrl: './eventi.component.scss'
})
export class EventiComponent implements OnInit {
  isLoggedIn: boolean = false;
  username: string = '';

  // Filtri dinamici dal DB
  listaSport: string[] = [];
  listaCategorie: string[] = [];
  listaSedi: Impianto[] = [];

  // Variabili per i filtri selezionati dall'utente
  filtroInizio: string = '';
  filtroFine: string = '';
  filtroSport: string = '';
  filtroCategoria: string = '';
  filtroSede: string = '';

  eventiList: any[] = [];
  
  isDettaglioOpen: boolean = false;
  isPagamentoOpen: boolean = false;
  eventoSelezionato: any = null;
  metodoPagamento: string = '';
  
  numeroCarta: string = '';
  scadenzaCarta: string = '';
  cvv: string = '';
  nomeIntestatario: string = '';

  constructor(
    private session: SessionService,
    private router: Router,
    private attivitaService: AttivitaService,
    private impiantoService: ImpiantoService,
    private iscrizioneService: IscrizioneService,
    private sottoscrizioneService: SottoscrizioneService
  ) {}

  ngOnInit(): void {
    // Recupera l'utente dalla sessione per mostrare il nome e gestire i permessi
    const user = this.session.getLoggedUser();
    if (user) {
      this.isLoggedIn = true;
      this.username = user.nome || user.username || user.email || 'Ospite';
    } else {
      this.isLoggedIn = false;
    }
    
    // Caricamento iniziale dei dati
    this.caricaFiltri();
    this.caricaEventi();
  }

  /**
   * Recupera dinamicamente le voci uniche per popolare le tendine dei filtri.
   * Chiama il backend per i tipi di evento, i destinatari e l'elenco degli impianti.
   */
  caricaFiltri(): void {
    this.attivitaService.getTipiEvento().subscribe(data => this.listaSport = data);
    this.attivitaService.getDestinatari().subscribe(data => this.listaCategorie = data);
    this.impiantoService.getAll().subscribe(data => this.listaSedi = data);
  }

  /**
   * Carica la lista completa di tutte le attività (eventi) attive dal backend.
   */
  caricaEventi(): void {
    this.attivitaService.getAll().subscribe(data => {
      this.eventiList = this.filtraEventiFuturi(data);
    });
  }

  /**
   * Applica i filtri selezionati dall'utente invocando l'endpoint di ricerca
   * avanzata del backend.
   */
  avviaRicerca(): void {
    this.attivitaService.filtra({
      idImpianto: this.filtroSede ? Number(this.filtroSede) : undefined,
      target: this.filtroCategoria ? this.filtroCategoria : undefined,
      tipoEvento: this.filtroSport ? this.filtroSport : undefined,
      inizio: this.filtroInizio ? (this.filtroInizio.length === 16 ? this.filtroInizio + ':00' : this.filtroInizio) : undefined,
      fine: this.filtroFine ? (this.filtroFine.length === 16 ? this.filtroFine + ':00' : this.filtroFine) : undefined
    } as any).subscribe(data => {
      this.eventiList = this.filtraEventiFuturi(data);
    });
  }

  /**
   * Rimuove dall'elenco gli eventi che hanno *tutte* le date nel passato.
   * Mantiene gli eventi che hanno almeno una data futura (o nessuna data assegnata).
   */
  private filtraEventiFuturi(eventi: any[]): any[] {
    const now = new Date();
    return eventi.filter(ev => {
      if (!ev.dateOrari || ev.dateOrari.length === 0) return true;
      return ev.dateOrari.some((d: string) => new Date(d) >= now);
    });
  }

  apriDettaglio(evento: any): void {
    this.eventoSelezionato = evento;
    this.isDettaglioOpen = true;
  }

  chiudiModali(): void {
    this.isDettaglioOpen = false;
    this.isPagamentoOpen = false;
    this.eventoSelezionato = null;
    this.metodoPagamento = '';
    this.numeroCarta = '';
    this.scadenzaCarta = '';
    this.cvv = '';
    this.nomeIntestatario = '';
  }

  /**
   * Gestisce l'iscrizione scalando un ingresso o verificando l'abbonamento temporale.
   * Controlla prima se l'utente è loggato e idoneo.
   */
  usaAbbonamento(): void {
    if (!this.checkLoginEIdoneita()) return;

    const user = this.session.getLoggedUser();
    
    // Controlla se possiede un abbonamento attivo
    this.sottoscrizioneService.getAbbonamentiAtleta(user?.cf || '').subscribe({
      next: (abbonamenti) => {
        const abbAttivo = abbonamenti.find(a => a.statoAbb === 'ATTIVO');
        if (!abbAttivo) {
          alert('Non hai alcun abbonamento attivo.');
          return;
        }
        
        this.iscrizioneService.usaAbbonamento({
          atletaCf: user?.cf || '',
          attivitaId: this.eventoSelezionato.codiceAtt,
          abbonamentoId: abbAttivo.numeroAbb
        }).subscribe({
          next: () => {
            alert('Iscrizione completata con successo tramite abbonamento!');
            this.chiudiModali();
            this.caricaEventi(); // per aggiornare iscritti
          },
          error: (err) => alert('Errore: ' + (err.error?.message || err.error || 'Impossibile usare l\'abbonamento.'))
        });
      },
      error: () => alert('Impossibile verificare abbonamento attivo.')
    });
  }

  /**
   * Mostra il form (mock) per il pagamento singolo nascondendo il dettaglio.
   */
  pagaSingolo(): void {
    if (!this.checkLoginEIdoneita()) return;
    this.isDettaglioOpen = false;
    this.isPagamentoOpen = true;
  }

  /**
   * Conferma l'iscrizione con pagamento singolo chiamando l'API.
   * Invia il metodo inserito (o 'CARTA' di default) al backend.
   */
  confermaPagamentoFinale(): void {
    if (!this.numeroCarta || !this.numeroCarta.match(/^[0-9]{16}$/)) {
      alert("Il numero della carta deve contenere 16 cifre numeriche.");
      return;
    }
    if (!this.scadenzaCarta || !this.scadenzaCarta.match(/^(0[1-9]|1[0-2])\/[0-9]{2}$/)) {
      alert("La data di scadenza deve essere nel formato MM/AA.");
      return;
    }
    const [mese, anno] = this.scadenzaCarta.split('/');
    const expDate = new Date(2000 + parseInt(anno), parseInt(mese) - 1, 1);
    if (expDate < new Date(new Date().getFullYear(), new Date().getMonth(), 1)) {
      alert("La carta risulta scaduta.");
      return;
    }
    if (!this.cvv || !this.cvv.match(/^[0-9]{3}$/)) {
      alert("Il CVV deve contenere 3 cifre numeriche.");
      return;
    }
    if (!this.nomeIntestatario || this.nomeIntestatario.trim().length === 0) {
      alert("Il nome dell'intestatario è obbligatorio.");
      return;
    }

    if(!this.metodoPagamento || this.metodoPagamento.trim() === '') {
       this.metodoPagamento = 'CARTA'; // default fake
    }

    const user = this.session.getLoggedUser();
    this.iscrizioneService.iscriviSingola({
      atletaCf: user?.cf || '',
      attivitaId: this.eventoSelezionato.codiceAtt,
      importo: this.eventoSelezionato.quotaBase,
      metodo: this.metodoPagamento
    }).subscribe({
      next: () => {
        alert('Pagamento approvato. Sei ufficialmente iscritto!');
        if (user) {
          user.puntiGamification = (user.puntiGamification || 0) + Math.floor(this.eventoSelezionato.quotaBase);
          this.session.setLoggedUser(user);
        }
        this.chiudiModali();
        this.caricaEventi();
      },
      error: (err) => alert('Errore durante l\'iscrizione: ' + (err.error?.message || err.error || 'Problema imprevisto.'))
    });
  }

  /**
   * Metodo di validazione centralizzato:
   * 1. Verifica che l'utente sia loggato (altrimenti redirect al login).
   * 2. Verifica che il ruolo sia ATLETA.
   * I controlli su capienza, età e certificato medico li fa il backend.
   */
  private checkLoginEIdoneita(): boolean {
    if (!this.isLoggedIn) {
      alert('Devi aver effettuato l\'accesso per poterti iscrivere. Verrai reindirizzato al Login.');
      this.chiudiModali();
      this.router.navigate(['/login']);
      return false;
    }
    const user = this.session.getLoggedUser();
    if(user?.tipoIscritto !== 'ATLETA') {
      alert('Solo gli atleti possono iscriversi alle attività. Usa l\'area admin per gestire gli iscritti.');
      return false;
    }
    // NOTA: Il backend controlla l'età, i posti disponibili e la validità del certificato medico.
    // L'errore scatenato dal backend (status 400/500) bloccherà l'iscrizione.
    return true;
  }
}