import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SponsorizzazioneService, Sponsorizzazione } from '../../../service/sponsorizzazione.service';
import { FormsModule } from '@angular/forms';
import { SquadraService } from '../../../service/squadra.service';
import { ImpiantoService } from '../../../service/impianto.service';
import { SquadraResponseDTO } from '../../../dto/response/squadra-response.dto';

@Component({
  selector: 'app-gestione-sponsor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestione-sponsor.component.html',
  styleUrl: './gestione-sponsor.component.scss'
})
export class GestioneSponsorComponent implements OnInit {

  sponsorShip: Sponsorizzazione[] = [];
  squadre: SquadraResponseDTO[] = [];
  impianti: any[] = [];

  // Modale Variabili
  isModalOpen: boolean = false;
  isEditMode: boolean = false;
  sponsorForm: any = {
    pIva: '',
    azienda: '',
    contatto: '',
    dataInizio: '',
    dataFine: '',
    importo: null,
    targetType: 'squadra',
    targetId: ''
  };
  sponsorSelezionatoId: number | null = null;

  constructor(
    private sponsorizzazioneService: SponsorizzazioneService,
    private squadraService: SquadraService,
    private impiantoService: ImpiantoService
  ) { }

  ngOnInit(): void {
    this.caricaSponsorizzazioni();
    this.squadraService.getAll().subscribe(res => this.squadre = res);
    this.impiantoService.getAll().subscribe(res => this.impianti = res);
  }

  /**
   * Recupera dal backend (tramite SponsorizzazioneService) la lista
   * completa di tutti i contratti di sponsorizzazione registrati.
   */
  caricaSponsorizzazioni(): void {
    this.sponsorizzazioneService.getAll().subscribe({
      next: (data) => this.sponsorShip = data,
      error: () => alert('Impossibile caricare i contratti di sponsorizzazione.')
    });
  }

  /**
   * Pre-popola il form modale in modalità "Modifica" con i dati dello sponsor selezionato.
   * Gestisce sia la mappatura dell'entità Sponsor che il target (Squadra o Impianto).
   * 
   * @param sp L'oggetto sponsorizzazione da modificare
   */
  configuraSponsor(sp: Sponsorizzazione): void {
    this.isEditMode = true;
    this.sponsorSelezionatoId = sp.idSponsorizzazione || null;
    this.sponsorForm = {
      partitaIva: sp.sponsor?.partitaIva,
      azienda: sp.sponsor?.azienda,
      contatto: sp.sponsor?.contatto,
      dataInizio: sp.dataInizio,
      dataFine: sp.dataFine,
      importo: sp.importo,
      targetType: sp.squadra ? 'squadra' : 'impianto',
      targetId: sp.squadra?.id || sp.impianto?.id || ''
    };
    this.isModalOpen = true;
  }

  /**
   * Inizializza il form modale in modalità "Creazione", 
   * azzerando i valori per l'inserimento di un nuovo contratto di sponsorizzazione.
   */
  nuovoSponsor(): void {
    this.isEditMode = false;
    this.sponsorSelezionatoId = null;
    this.sponsorForm = {
      partitaIva: '', azienda: '', contatto: '', dataInizio: '', dataFine: '', importo: null, targetType: 'squadra', targetId: ''
    };
    this.isModalOpen = true;
  }

  /**
   * Chiude il modale senza effettuare il salvataggio dei dati.
   */
  chiudiModale(): void {
    this.isModalOpen = false;
  }

  /**
   * Invia i dati inseriti nel form (modalità Crea o Modifica) al backend.
   * Crea dinamicamente il payload associando, se previsti, i riferimenti
   * alla squadra o all'impianto target.
   */
  salvaSponsor(): void {
    // Verifica che i campi obbligatori del form siano compilati prima di procedere
    if (!this.sponsorForm.partitaIva || !this.sponsorForm.dataInizio || !this.sponsorForm.dataFine || !this.sponsorForm.importo) {
      alert('Compila tutti i campi obbligatori (Partita IVA, Date, Importo).');
      return;
    }

    const payload: any = {
      sponsor: {
        partitaIva: this.sponsorForm.partitaIva,
        azienda: this.sponsorForm.azienda,
        contatto: this.sponsorForm.contatto
      },
      dataInizio: this.sponsorForm.dataInizio,
      dataFine: this.sponsorForm.dataFine,
      importo: this.sponsorForm.importo
    };

    // Verifica che il valore corrisponda a quello atteso prima di procedere
    if (this.sponsorForm.targetType === 'squadra' && this.sponsorForm.targetId) {
      payload.squadra = { id: this.sponsorForm.targetId };
    } else if (this.sponsorForm.targetType === 'impianto' && this.sponsorForm.targetId) {
      payload.impianto = { id: this.sponsorForm.targetId };
    }

    // Verifica che i parametri richiesti siano presenti e validi prima di procedere
    if (this.isEditMode && this.sponsorSelezionatoId) {
      this.sponsorizzazioneService.update(this.sponsorSelezionatoId, payload).subscribe({
        next: () => {
          alert('Sponsorizzazione modificata!');
          this.isModalOpen = false;
          this.caricaSponsorizzazioni();
        },
        error: (err) => alert('Errore: ' + (err.error?.message || ''))
      });
    } else {  // 
      this.sponsorizzazioneService.create(payload).subscribe({
        next: () => {
          alert('Sponsorizzazione creata!');
          this.isModalOpen = false;
          this.caricaSponsorizzazioni();
        },
        error: (err) => alert('Errore: ' + (err.error?.message || ''))
      });
    }
  }

  /**
   * Cancella fisicamente il contratto di sponsorizzazione selezionato 
   * tramite chiamata API.
   * 
   * @param id L'identificativo della sponsorizzazione
   */
  eliminaSponsor(id: number): void {
    // Verifica che l'utente abbia confermato l'operazione prima di procedere
    if (confirm('Sei sicuro di voler cancellare questa sponsorizzazione?')) {
      this.sponsorizzazioneService.delete(id).subscribe({
        next: () => {
          alert('Eliminata con successo');
          this.caricaSponsorizzazioni();
        },
        error: () => alert('Errore eliminazione')
      });
    }
  }

  /**
   * Estende la data di fine validità del contratto di 1 anno rispetto
   * all'attuale data di scadenza e invia l'aggiornamento (PUT) al backend.
   * 
   * @param sponsorizzazione L'oggetto sponsorizzazione da rinnovare
   */
  rinnovaContratto(sponsorizzazione: Sponsorizzazione): void {
    // Verifica che i parametri richiesti siano presenti e validi prima di procedere
    if (!sponsorizzazione.idSponsorizzazione || !sponsorizzazione.dataFine) return;

    // Logica fittizia di rinnovo veloce (+1 anno alla scadenza)
    const currentData = new Date(sponsorizzazione.dataFine);
    currentData.setFullYear(currentData.getFullYear() + 1);

    // Aggiorno l'oggetto per inviare la request
    const updatedSponsorizzazione = { ...sponsorizzazione, dataFine: currentData.toISOString().split('T')[0] };

    this.sponsorizzazioneService.update(sponsorizzazione.idSponsorizzazione, updatedSponsorizzazione).subscribe({
      next: () => {
        alert(`Rinnovo elettronico effettuato. Nuova scadenza: ${updatedSponsorizzazione.dataFine}`);
        this.caricaSponsorizzazioni();
      },
      error: (err) => alert('Errore durante il rinnovo: ' + (err.error?.message || ''))
    });
  }
}