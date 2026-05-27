import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IstruttoreService } from '../../../service/istruttore.service';
import { SessionService } from '../../../service/session.service';
import { AttivitaService } from '../../../service/attivita.service';
import { ImpiantoService } from '../../../service/impianto.service';
import { IscrizioneService } from '../../../service/iscrizione.service';
import { UserResponseDTO } from '../../../dto/response/user-response.dto';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-corsi-istruttore',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './corsi-istruttore.component.html',
  styleUrl: './corsi-istruttore.component.scss'
})
export class CorsiIstruttoreComponent implements OnInit {
  
  mieiCorsi: any[] = [];
  impianti: any[] = [];
  isModalOpen: boolean = false;
  corsoSelezionato: any = null;
  elencoIscritti: UserResponseDTO[] = [];

  isFormOpen: boolean = false;
  isEditMode: boolean = false;
  attivitaForm: any = {
    codiceAtt: null, nomeAtt: '', tipoEvento: 'Corso', destinatario: '', 
    quotaBase: 0, maxPartecipanti: 10, descrizione: '', istruttoreCf: '', 
    impiantoId: '', dateOrari: [], squadreIds: []
  };
  nuovaDataOra: string = '';

  constructor(
    private istruttoreService: IstruttoreService,
    private sessionService: SessionService,
    private attivitaService: AttivitaService,
    private impiantoService: ImpiantoService,
    private iscrizioneService: IscrizioneService
  ) {}

  /**
   * Inizializzazione componente: carica i corsi dell'istruttore e la lista degli impianti.
   */
  ngOnInit(): void {
    this.caricaCorsi();
    this.impiantoService.getAll().subscribe(imp => this.impianti = imp);
  }

  /**
   * Recupera dal backend la lista delle attività (corsi) di cui l'utente loggato è l'istruttore.
   */
  caricaCorsi(): void {
    const cf = this.sessionService.getLoggedUser()?.cf;
    if(cf) {
      this.istruttoreService.getAttivita(cf).subscribe({
        next: (data) => this.mieiCorsi = data,
        error: () => alert('Impossibile recuperare i corsi assegnati.')
      });
    }
  }

  /**
   * Apre il modale del Roster iscritti per un determinato corso
   * e invoca il servizio per recuperarne l'elenco.
   * 
   * @param corso I dati del corso selezionato
   */
  apriRoster(corso: any): void {
    this.corsoSelezionato = corso;
    this.isModalOpen = true;
    this.elencoIscritti = [];
    this.iscrizioneService.getIscrittiByAttivita(corso.codiceAtt).subscribe({
      next: (iscritti) => this.elencoIscritti = iscritti,
      error: () => alert('Errore nel recupero della lista iscritti')
    });
  }

  /**
   * Chiude il modale del Roster.
   */
  chiudiRoster(): void {
    this.isModalOpen = false;
    this.corsoSelezionato = null;
  }

  /**
   * Inizializza il form modale in stato di creazione per un nuovo Corso.
   */
  creaCorso(): void { 
    this.isEditMode = false;
    this.attivitaForm = {
      codiceAtt: null, nomeAtt: '', tipoEvento: 'Corso', destinatario: '', 
      quotaBase: 0, maxPartecipanti: 10, descrizione: '', 
      istruttoreCf: this.sessionService.getLoggedUser()?.cf, 
      impiantoId: '', dateOrari: [], squadreIds: []
    };
    this.nuovaDataOra = '';
    this.isFormOpen = true; 
  }
  
  /**
   * Apre il form modale popolato con i dati del corso per effettuare una modifica.
   * 
   * @param corso I dati del corso da modificare
   */
  spostaCorso(corso: any): void { 
    this.isEditMode = true;
    this.attivitaForm = {
      codiceAtt: corso.codiceAtt, nomeAtt: corso.nomeAtt, tipoEvento: corso.tipoEvento, 
      destinatario: corso.destinatario, quotaBase: corso.quotaBase, maxPartecipanti: corso.maxPartecipanti, 
      descrizione: corso.descrizione, istruttoreCf: corso.istruttoreCf, 
      impiantoId: corso.impiantoId, 
      dateOrari: corso.dateOrari ? [...corso.dateOrari] : [], 
      squadreIds: []
    };
    this.nuovaDataOra = '';
    this.isFormOpen = true; 
  }

  /**
   * Aggiunge una nuova data all'elenco delle date/orari del corso.
   */
  aggiungiData(): void {
    if (this.nuovaDataOra) {
      this.attivitaForm.dateOrari.push(this.nuovaDataOra);
      this.nuovaDataOra = '';
    }
  }

  /**
   * Rimuove una data dall'elenco temporaneo del form.
   * 
   * @param index L'indice della data da rimuovere
   */
  rimuoviData(index: number): void {
    this.attivitaForm.dateOrari.splice(index, 1);
  }

  /**
   * Chiude il form di creazione/modifica corso annullando i dati inseriti.
   */
  chiudiForm(): void {
    this.isFormOpen = false;
  }

  /**
   * Invia i dati del form al backend per creare o modificare il corso.
   */
  salvaCorso(): void {
    if(!this.attivitaForm.nomeAtt || !this.attivitaForm.tipoEvento || !this.attivitaForm.impiantoId || !this.attivitaForm.maxPartecipanti) {
      alert('Compila tutti i campi obbligatori!');
      return;
    }

    const obs$ = this.isEditMode 
      ? this.attivitaService.update(this.attivitaForm.codiceAtt, this.attivitaForm)
      : this.attivitaService.create(this.attivitaForm);

    obs$.subscribe({
      next: () => {
        alert('Corso salvato!');
        this.isFormOpen = false;
        this.caricaCorsi();
      },
      error: (err) => alert('Errore: ' + (err.error?.message || ''))
    });
  }

  /**
   * Cancella definitivamente un corso previo alert di conferma.
   * 
   * @param id Il codice identificativo del corso da cancellare
   */
  cancellaCorso(id: number): void { 
    if(confirm('Cancellare questo corso? L\'operazione annullerà anche tutte le iscrizioni associate.')) {
      this.attivitaService.delete(id).subscribe({
        next: () => {
          alert('Corso cancellato.');
          this.caricaCorsi();
        },
        error: () => alert('Impossibile cancellare il corso.')
      });
    }
  }
}