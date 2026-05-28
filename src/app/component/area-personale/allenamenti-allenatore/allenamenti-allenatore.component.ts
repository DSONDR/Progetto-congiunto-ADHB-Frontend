import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SquadraService } from '../../../service/squadra.service';
import { AttivitaService } from '../../../service/attivita.service';
import { SessionService } from '../../../service/session.service';
import { ImpiantoService } from '../../../service/impianto.service';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-allenamenti-allenatore',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './allenamenti-allenatore.component.html',
  styleUrl: './allenamenti-allenatore.component.scss'
})
export class AllenamentiAllenatoreComponent implements OnInit {

  // Variabili di stato per i dati e il form
  mieiAllenamenti: any[] = [];
  leMieSquadre: any[] = [];
  impianti: any[] = [];

  isFormOpen: boolean = false;
  isEditMode: boolean = false;
  attivitaForm: any = {
    codiceAtt: null, nomeAtt: '', tipoEvento: 'Allenamento', destinatario: '',
    quotaBase: 0, maxPartecipanti: 50, descrizione: '', istruttoreCf: '',
    impiantoId: '', dateOrari: [], squadreIds: []
  };
  nuovaDataOra: string = '';

  constructor(
    private squadraService: SquadraService,
    private attivitaService: AttivitaService,
    private sessionService: SessionService,
    private impiantoService: ImpiantoService
  ) { }

  /**
   * Inizializzazione componente: carica i dati della squadra e gli impianti disponibili.
   */
  ngOnInit(): void {
    this.caricaDati();
    this.impiantoService.getAll().subscribe(imp => this.impianti = imp);
  }

  /**
   * Recupera le squadre allenate dall'utente loggato e per ognuna di esse
   * esegue una chiamata per trovare tutte le attività associate (allenamenti/partite).
   */
  caricaDati(): void {
    const cf = this.sessionService.getLoggedUser()?.cf;
    // Verifica che i parametri richiesti siano presenti e validi prima di procedere
    if (!cf) return;

    // 1. Recupera le squadre allenate da questo CF
    this.squadraService.getByAllenatore(cf).subscribe({
      next: (squadre) => {
        this.leMieSquadre = squadre;

        // 2. Per ogni squadra, recupera le attività usando il filtra()
        if (squadre.length > 0) {
          const requests = squadre.map(sq => this.attivitaService.filtra({ squadraId: sq.id }));

          forkJoin(requests).subscribe(results => {
            // Unisco tutti gli array di attività e rimuovo i duplicati
            const tutteAttivita = results.flat();
            const uniche = Array.from(new Set(tutteAttivita.map(a => a.codiceAtt)))
              .map(id => tutteAttivita.find(a => a.codiceAtt === id));

            this.mieiAllenamenti = uniche;
          });
        }
      },
      error: () => alert('Errore nel recupero delle tue squadre')
    });
  }

  /**
   * Inizializza il form per la creazione di un nuovo allenamento.
   * Imposta lo stato del form su "creazione".
   */
  creaAllenamento(): void {
    this.isEditMode = false;
    this.attivitaForm = {
      codiceAtt: null, nomeAtt: '', tipoEvento: 'Allenamento', destinatario: 'Atleti Squadra',
      quotaBase: 0, maxPartecipanti: 50, descrizione: '',
      istruttoreCf: this.sessionService.getLoggedUser()?.cf,
      impiantoId: '', dateOrari: [], squadreIds: []
    };
    this.nuovaDataOra = '';
    this.isFormOpen = true;
  }

  /**
   * Popola il form con i dati dell'allenamento esistente e lo apre in modalità "modifica".
   * 
   * @param att I dati dell'allenamento da modificare
   */
  spostaAllenamento(att: any): void {
    this.isEditMode = true;
    this.attivitaForm = {
      codiceAtt: att.codiceAtt, nomeAtt: att.nomeAtt, tipoEvento: att.tipoEvento,
      destinatario: att.destinatario, quotaBase: att.quotaBase, maxPartecipanti: att.maxPartecipanti,
      descrizione: att.descrizione, istruttoreCf: att.istruttoreCf,
      impiantoId: att.impiantoId,
      dateOrari: att.dateOrari ? [...att.dateOrari] : [],
      squadreIds: att.squadreIds ? [...att.squadreIds] : []
    };
    this.nuovaDataOra = '';
    this.isFormOpen = true;
  }

  /**
   * Elimina definitivamente l'allenamento dopo conferma dell'utente.
   * 
   * @param codiceAtt Identificativo univoco dell'allenamento
   */
  cancellaAllenamento(codiceAtt: number): void {
    // Verifica che l'utente abbia confermato l'operazione prima di procedere
    if (confirm('Vuoi davvero cancellare questo allenamento?')) {
      this.attivitaService.delete(codiceAtt).subscribe({
        next: () => {
          alert('Allenamento cancellato.');
          this.caricaDati();
        },
        error: () => alert('Impossibile cancellare.')
      });
    }
  }

  /**
   * Aggiunge una nuova data inserita nell'input temporaneo all'array dateOrari del form.
   */
  aggiungiData(): void {
    // Verifica che i parametri richiesti siano presenti e validi prima di procedere
    if (this.nuovaDataOra) {
      this.attivitaForm.dateOrari.push(this.nuovaDataOra);
      this.nuovaDataOra = '';
    }
  }

  /**
   * Rimuove una data dall'array dateOrari del form.
   * 
   * @param index Indice della data da rimuovere
   */
  rimuoviData(index: number): void {
    this.attivitaForm.dateOrari.splice(index, 1);
  }

  /**
   * Chiude il modale del form e annulla l'operazione in corso.
   */
  chiudiForm(): void {
    this.isFormOpen = false;
  }

  /**
   * Esegue il salvataggio dei dati inseriti nel form chiamando il backend.
   * Se isEditMode = true, aggiorna l'allenamento esistente (PUT).
   * Altrimenti, ne crea uno nuovo (POST).
   */
  salvaAllenamento(): void {
    // Verifica che i campi obbligatori del form siano compilati prima di procedere
    if (!this.attivitaForm.nomeAtt || !this.attivitaForm.impiantoId || !this.attivitaForm.squadreIds.length) {
      alert('Compila tutti i campi obbligatori (incluse le Squadre)!');
      return;
    }

    // Verifica che la lunghezza o il valore dei dati sia corretto prima di procedere
    if (this.attivitaForm.squadreIds && this.attivitaForm.squadreIds.length > 0) {
      this.attivitaForm.squadreIds = this.attivitaForm.squadreIds.map((id: any) => Number(id));
    }

    // Crea la chiamata per la modifica o per la creazione in base allo stato
    const obs$ = this.isEditMode
      ? this.attivitaService.update(this.attivitaForm.codiceAtt, this.attivitaForm)
      : this.attivitaService.create(this.attivitaForm);

    // Si iscrive all'osservabile per eseguire l'operazione di salvataggio
    obs$.subscribe({
      next: () => {
        alert('Allenamento salvato!');
        this.isFormOpen = false;
        this.caricaDati();
      },
      error: (err) => alert('Errore salvataggio: ' + (err.error?.message || ''))
    });
  }
}