import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SessionService } from '../../service/session.service';
import { SottoscrizioneService } from '../../service/sottoscrizione.service';
import { AbbonamentoService } from '../../service/abbonamento.service';
import { Abbonamento, TipoAbbonamentoDTO } from '../../dto/response/abbonamento-response.dto';

@Component({
  selector: 'app-abbonamenti',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './abbonamenti-menu.component.html',
  styleUrl: './abbonamenti-menu.component.scss'
})
export class AbbonamentiMenuComponent implements OnInit {

  /** Stato per navigare tra lo shop e i propri abbonamenti */
  vistaCorrente: 'VETRINA' | 'I_MIEI' = 'VETRINA';

  /** Lista degli abbonamenti correntemente attivi o sospesi per l'utente loggato. */
  abbonamenti: Abbonamento[] = [];

  /** Lista dei tipi di abbonamento reali dal backend */
  tipiAbbonamento: TipoAbbonamentoDTO[] = [];

  // Variabili Modale Pagamento
  isPagamentoOpen: boolean = false;
  tipoSelezionato: string = '';
  numeroCarta: string = '';
  scadenzaCarta: string = '';
  cvv: string = '';
  nomeIntestatario: string = '';
  metodoPagamento: string = '';

  constructor(
    private session: SessionService,
    private router: Router,
    private sottoscrizioneService: SottoscrizioneService,
    private abbonamentoService: AbbonamentoService
  ) { }

  /**
   * Viene eseguito all'avvio del componente.
   * Si occupa di ricaricare la lista degli abbonamenti posseduti dall'utente e
   * di caricare il listino dei tipi di abbonamento disponibili dal backend.
   */
  ngOnInit(): void {
    this.caricaAbbonamentiUtente();
    this.abbonamentoService.getTipiAbbonamento().subscribe((data: TipoAbbonamentoDTO[]) => {
      this.tipiAbbonamento = data;
    });
  }

  /**
   * Effettua una chiamata API al backend per recuperare gli abbonamenti 
   * dell'utente loggato, filtrandoli per mostrare solo quelli "ATTIVI" o "SOSPESI".
   */
  caricaAbbonamentiUtente() {
    const utenteCorrente = this.session.getLoggedUser();
    // Verifica che l'utente sia loggato e i dati siano presenti prima di procedere
    if (utenteCorrente && utenteCorrente.cf) {
      this.sottoscrizioneService.getAbbonamentiAtleta(utenteCorrente.cf).subscribe({
        next: (data: Abbonamento[]) => {
          this.abbonamenti = data.filter((a: Abbonamento) => a.statoAbb === 'ATTIVO' || a.statoAbb === 'SOSPESO');
        },
        error: (err: any) => {
          console.error('Errore nel recupero degli abbonamenti:', err);
        }
      });
    }
  }

  /**
   * Cambia la tab visibile tra "VETRINA" (listino acquisti) e "I_MIEI" (dashboard atleta).
   * Se si passa alla vista "I_MIEI", forza un aggiornamento dei dati dell'utente.
   */
  cambiaVista(vista: 'VETRINA' | 'I_MIEI') {
    this.vistaCorrente = vista;
    // Verifica che il valore corrisponda a quello atteso prima di procedere
    if (vista === 'I_MIEI') {
      this.caricaAbbonamentiUtente();
    }
  }

  /**
   * Verifica se l'utente è loggato, in caso contrario lo reindirizza al login.
   * Se è loggato, apre la modale di pagamento per l'abbonamento selezionato.
   */
  apriPagamento(tipoAbb: string) {
    const utenteCorrente = this.session.getLoggedUser();

    // Controllo sicurezza: solo gli utenti autenticati possono proseguire con l'acquisto
    if (!utenteCorrente || !utenteCorrente.cf) {
      alert("Devi essere loggato per effettuare un acquisto. Reindirizzamento al login.");
      this.router.navigate(['/login']);
      return;
    }
    this.tipoSelezionato = tipoAbb;
    this.isPagamentoOpen = true;
  }

  /** Chiude la modale e resetta i campi del form fittizio */
  chiudiModali() {
    this.isPagamentoOpen = false;
    this.tipoSelezionato = '';
    this.numeroCarta = '';
    this.scadenzaCarta = '';
    this.cvv = '';
    this.nomeIntestatario = '';
    this.metodoPagamento = '';
  }

  /**
   * Viene invocato al click su "Conferma e Paga" nella modale.
   * Valida (simulatamente) i campi della carta e invoca l'API di backend
   * per la generazione della Sottoscrizione e del Pagamento associato.
   */
  confermaPagamentoFinale(): void {
    // Validazione lunghezza e formato carta (16 cifre esatte)
    if (!this.numeroCarta || !this.numeroCarta.match(/^[0-9]{16}$/)) {
      alert("Il numero della carta deve contenere 16 cifre numeriche.");
      return;
    }

    // Validazione scadenza carta (MM/AA)
    if (!this.scadenzaCarta || !this.scadenzaCarta.match(/^(0[1-9]|1[0-2])\/[0-9]{2}$/)) {
      alert("La data di scadenza deve essere nel formato MM/AA.");
      return;
    }

    // Validazione codice sicurezza CVV (3 cifre)
    if (!this.cvv || !this.cvv.match(/^[0-9]{3}$/)) {
      alert("Il CVV deve contenere 3 cifre numeriche.");
      return;
    }

    // Validazione nome intestatario
    if (!this.nomeIntestatario || this.nomeIntestatario.trim().length === 0) {
      alert("Il nome dell'intestatario è obbligatorio.");
      return;
    }

    // Verifica che il valore corrisponda a quello atteso prima di procedere
    if (!this.metodoPagamento || this.metodoPagamento.trim() === '') {
      this.metodoPagamento = 'CARTA'; // default fake
    }

    // Recuperiamo dal SessionService l'utente attualmente loggato per associarlo all'acquisto
    const utenteCorrente = this.session.getLoggedUser();
    const request = {
      atletaCf: utenteCorrente!.cf,
      tipoAbbonamento: this.tipoSelezionato,
      metodo: this.metodoPagamento
    };

    // Invoca il servizio di frontend per creare l'abbonamento e il pagamento nel backend
    this.sottoscrizioneService.sottoscrivi(request).subscribe({
      next: (res: any) => {
        alert("Abbonamento acquistato con successo!" + (res.avviso ? "\nAvviso: " + res.avviso : ""));
        this.chiudiModali();
        this.cambiaVista('I_MIEI');
      },
      error: (err: any) => {
        console.error(err);
        alert("Si è verificato un errore durante l'acquisto.");
      }
    });
  }

  // Gestisce la logica di disdiciAbbonamento nel componente.
  disdiciAbbonamento(abb: Abbonamento) {
    // Verifica che l'utente abbia confermato l'operazione prima di procedere
    if (confirm('Sei sicuro di voler disdire e rimuovere questo abbonamento?')) {
      // Verifica che i parametri richiesti siano presenti e validi prima di procedere
      if (!abb.pagamento || !abb.atleta) {
        alert("Dati abbonamento incompleti per la cancellazione.");
        return;
      }
      this.sottoscrizioneService.delete(abb.numeroAbb, abb.pagamento.idPagamento, abb.atleta.cf).subscribe({
        next: () => {
          alert('Abbonamento disdetto con successo!');
          this.caricaAbbonamentiUtente();
        },
        error: (err: any) => {
          console.error(err);
          alert('Errore durante la disdetta');
        }
      });
    }
  }
}
