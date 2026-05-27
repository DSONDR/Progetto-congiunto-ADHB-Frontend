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
  ) {}

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

  aggiungiData(): void {
    if (this.nuovaDataOra) {
      this.attivitaForm.dateOrari.push(this.nuovaDataOra);
      this.nuovaDataOra = '';
    }
  }

  rimuoviData(index: number): void {
    this.attivitaForm.dateOrari.splice(index, 1);
  }

  chiudiModale(): void {
    this.isModalOpen = false;
  }

  salvaAttivita(): void {
    if(!this.attivitaForm.nomeAtt || !this.attivitaForm.tipoEvento || !this.attivitaForm.istruttoreCf || !this.attivitaForm.impiantoId || !this.attivitaForm.maxPartecipanti) {
      alert('Compila tutti i campi obbligatori!');
      return;
    }

    // Le squadre le passo come stringhe dall'HTML per la multi-select, le converto in numeri
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
  
  cancellaAttivita(id: number): void { 
    if(confirm(`Sei sicuro di voler cancellare l'attività ID ${id}? Questa azione eliminerà anche le sessioni e rimuoverà gli iscritti.`)) {
      this.attivitaService.delete(id).subscribe({
        next: () => {
          alert('Attività cancellata correttamente.');
          this.caricaAttivita();
        },
        error: (err) => alert('Impossibile cancellare l\'attività. ' + (err.error?.message || ''))
      });
    }
  }
}