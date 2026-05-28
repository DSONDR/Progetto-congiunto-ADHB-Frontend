import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AttivitaService } from '../../../service/attivita.service';
import { ImpiantoService } from '../../../service/impianto.service';
import { IstruttoreService } from '../../../service/istruttore.service';
import { SquadraService } from '../../../service/squadra.service';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-gestione-attivita',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './gestione-attivita.component.html',
  styleUrl: './gestione-attivita.component.scss'
})
export class GestioneAttivitaComponent implements OnInit {

  attivitaList: any[] = [];
  impianti: any[] = [];
  istruttori: any[] = [];
  squadre: any[] = [];

  isModalOpen: boolean = false;
  isEditMode: boolean = false;
  attivitaForm: any = {
    codiceAtt: null, nomeAtt: '', tipoEvento: 'Corso', destinatario: '',
    quotaBase: 0, maxPartecipanti: 10, descrizione: '', istruttoreCf: '',
    impiantoId: '', dateOrari: [], squadreIds: []
  };
  nuovaDataOra: string = '';

  constructor(
    private attivitaService: AttivitaService,
    private impiantoService: ImpiantoService,
    private istruttoreService: IstruttoreService,
    private squadraService: SquadraService
  ) { }

  /**
   * Inizializza il componente caricando la lista delle attività 
   * e recuperando in parallelo impianti, istruttori e squadre necessari per il form.
   */
  ngOnInit(): void {
    this.caricaAttivita();
    forkJoin({
      imp: this.impiantoService.getAll(),
      ist: this.istruttoreService.getAll(),
      sq: this.squadraService.getAll()
    }).subscribe(({ imp, ist, sq }) => {
      this.impianti = imp;
      this.istruttori = ist;
      this.squadre = sq;
    });
  }

  /**
   * Carica tutte le attività sfruttando AttivitaService.
   */
  caricaAttivita(): void {
    this.attivitaService.getAll().subscribe({
      next: (data) => this.attivitaList = data,
      error: () => alert('Errore durante il caricamento delle attività.')
    });
  }

  /**
   * Prepara il form per la creazione di una nuova attività, resettando i campi
   * e aprendo la modale in modalità di inserimento (isEditMode = false).
   */
  creaAttivita(): void {
    this.isEditMode = false;
    this.attivitaForm = {
      codiceAtt: null, nomeAtt: '', tipoEvento: 'Corso', destinatario: '',
      quotaBase: 0, maxPartecipanti: 10, descrizione: '', istruttoreCf: '',
      impiantoId: '', dateOrari: [], squadreIds: []
    };
    this.nuovaDataOra = '';
    this.isModalOpen = true;
  }

  /**
   * Prepara il form per la modifica di un'attività esistente.
   * Popola i campi con i dati dell'attività selezionata e apre la modale in modalità modifica.
   */
  modificaAttivita(att: any): void {
    this.isEditMode = true;
    this.attivitaForm = {
      codiceAtt: att.codiceAtt, nomeAtt: att.nomeAtt, tipoEvento: att.tipoEvento,
      destinatario: att.destinatario, quotaBase: att.quotaBase, maxPartecipanti: att.maxPartecipanti,
      descrizione: att.descrizione, istruttoreCf: att.istruttoreCf,
      impiantoId: att.impiantoId,
      dateOrari: att.dateOrari ? [...att.dateOrari] : [],
      squadreIds: [] // da caricare se necessario
    };
    this.nuovaDataOra = '';
    this.isModalOpen = true;
  }

  /**
   * Aggiunge la data e l'ora correntemente selezionate all'array delle sessioni programmate.
   */
  aggiungiData(): void {
    /**

     * Verifica che i parametri richiesti siano presenti e validi prima di procedere

     */

    if (this.nuovaDataOra) {
      this.attivitaForm.dateOrari.push(this.nuovaDataOra);
      this.nuovaDataOra = '';
    }
  }

  /**
   * Rimuove una data/ora specifica dall'elenco delle sessioni previste in base al suo indice.
   */
  rimuoviData(index: number): void {
    this.attivitaForm.dateOrari.splice(index, 1);
  }

  /**
   * Chiude la modale nascondendola all'utente.
   */
  chiudiModale(): void {
    this.isModalOpen = false;
  }

  /**
   * Gestisce il salvataggio dei dati del form.
   * Verifica che i campi obbligatori siano compilati, gestisce il formato degli ID delle squadre
   * e invia la richiesta di creazione o aggiornamento tramite il servizio.
   */
  salvaAttivita(): void {
    /**

     * Verifica che i campi obbligatori del form siano compilati prima di procedere

     */

    if (!this.attivitaForm.nomeAtt || !this.attivitaForm.tipoEvento || !this.attivitaForm.istruttoreCf || !this.attivitaForm.impiantoId || !this.attivitaForm.maxPartecipanti) {
      alert('Compila tutti i campi obbligatori!');
      return;
    }

    /**


     * Le squadre le passo come stringhe dall'HTML per la multi-select, le converto in numeri


     */


    if (this.attivitaForm.squadreIds && this.attivitaForm.squadreIds.length > 0) {
      this.attivitaForm.squadreIds = this.attivitaForm.squadreIds.map((id: any) => Number(id));
    }

    const obs$ = this.isEditMode
      ? this.attivitaService.update(this.attivitaForm.codiceAtt, this.attivitaForm)
      : this.attivitaService.create(this.attivitaForm);

    obs$.subscribe({
      next: () => {
        alert('Attività salvata con successo!');
        this.isModalOpen = false;
        this.caricaAttivita();
      },
      error: (err) => alert('Errore salvataggio: ' + (err.error?.message || ''))
    });
  }

  /**
   * Chiede conferma all'utente e, se accettato, invia la richiesta di cancellazione
   * dell'attività tramite il servizio, per poi ricaricare la lista.
   */
  cancellaAttivita(id: number): void {
    /**

     * Verifica che l'utente abbia confermato l'operazione prima di procedere

     */

    if (confirm(`Sei sicuro di voler cancellare l'attività ID ${id}? Questa azione eliminerà anche le sessioni e rimuoverà gli iscritti.`)) {
      this.attivitaService.delete(id).subscribe({
        next: () => {
          alert('Attività cancellata correttamente.');
          this.caricaAttivita();
        },
        error: (err) => alert("Impossibile cancellare l'attività. " + (err.error?.message || ''))
      });
    }
  }
}
