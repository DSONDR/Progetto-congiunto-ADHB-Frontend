import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SessionService } from '../../service/session.service';
import { SottoscrizioneService } from '../../service/sottoscrizione.service';
import { AbbonamentoService } from '../../service/abbonamento.service';
import { Abbonamento, TipoAbbonamentoDTO } from '../../dto/response/abbonamento-response.dto';

@Component({
  selector: 'app-abbonamenti',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './abbonamenti-menu.component.html',
  styleUrl: './abbonamenti-menu.component.scss'
})
export class AbbonamentiMenuComponent implements OnInit {

  isLoggedIn: boolean = false;
  username: string = '';

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
    const user = this.session.getLoggedUser();
    if (user) {
      this.isLoggedIn = true;
      this.username = (user as any).nome || user.username || user.email || 'Utente';
    } else {
      this.isLoggedIn = false;
    }

    this.abbonamentoService.getTipiAbbonamento().subscribe((data: TipoAbbonamentoDTO[]) => {
      this.tipiAbbonamento = data;
    });
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
    const [mese, anno] = this.scadenzaCarta.split('/');
    const expDate = new Date(2000 + parseInt(anno), parseInt(mese) - 1, 1);
    // Verifica che la lunghezza o il valore dei dati sia corretto prima di procedere
    if (expDate < new Date(new Date().getFullYear(), new Date().getMonth(), 1)) {
      alert("La carta risulta scaduta.");
      return;
    }

    // Validazione codice sicurezza CVV (3 cifre)
    if (!this.cvv || !this.cvv.match(/^[0-9]{3}$/)) {
      alert("Il CVV deve contenere 3 cifre numeriche.");
      return;
    }

    // Validazione nome intestatario (solo lettere e spazi)
    if (!this.nomeIntestatario || this.nomeIntestatario.trim().length === 0 || !/^[a-zA-Z\s]+$/.test(this.nomeIntestatario)) {
      alert("Il nome dell'intestatario è obbligatorio e deve contenere solo lettere.");
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
        // Aggiorna i punti gamification nella sessione corrente se l'acquisto dà punti
        if (utenteCorrente && this.metodoPagamento !== 'PUNTI') {
          const tipo = this.tipiAbbonamento.find(t => t.nome === this.tipoSelezionato);
          if (tipo) {
            const puntiAggiunti = Math.floor(tipo.prezzo);
            // Forza il cast a any o usa una property se esistente, per aggiornare i punti
            (utenteCorrente as any).puntiGamification = ((utenteCorrente as any).puntiGamification || 0) + puntiAggiunti;
            this.session.setLoggedUser(utenteCorrente);
          }
        }

        alert("Abbonamento acquistato con successo!" + (res.avviso ? "\nAvviso: " + res.avviso : ""));
        this.chiudiModali();
        this.router.navigate(['/area-personale/abbonamenti']);
      },
      error: (err: any) => {
        console.error(err);
        alert("Si è verificato un errore durante l'acquisto.");
      }
    });
  }
}
