import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SquadraService } from '../../../service/squadra.service';
import { SquadraResponseDTO } from '../../../dto/response/squadra-response.dto';
import { FormsModule } from '@angular/forms';
import { AllenatoreService } from '../../../service/allenatore.service';
import { UserResponseDTO } from '../../../dto/response/user-response.dto';

@Component({
  selector: 'app-gestione-squadre',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestione-squadre.component.html',
  styleUrl: './gestione-squadre.component.scss'
})
export class GestioneSquadreComponent implements OnInit {
  
  squadreSocietarie: SquadraResponseDTO[] = [];
  allenatori: UserResponseDTO[] = [];

  // Variabili per Modale Squadra
  isSquadraModalOpen: boolean = false;
  isEditMode: boolean = false;
  squadraSelezionataId: number | null = null;
  squadraForm: any = {
    nome: '',
    sport: '',
    campionato: '',
    allenatoreCf: ''
  };

  // Variabili per Modale Roster
  isRosterModalOpen: boolean = false;
  squadraRosterSelezionata: SquadraResponseDTO | null = null;
  atletiRoster: UserResponseDTO[] = [];
  nuovoAtletaCf: string = '';

  constructor(
    private squadraService: SquadraService,
    private allenatoreService: AllenatoreService
  ) {}

  ngOnInit(): void {
    this.caricaSquadre();
  }

  /**
   * Recupera dal backend la lista di tutte le squadre e contestualmente
   * l'elenco degli allenatori disponibili per l'assegnazione.
   */
  caricaSquadre(): void {
    this.squadraService.getAll().subscribe({
      next: (data) => this.squadreSocietarie = data,
      error: () => alert('Impossibile caricare le squadre.')
    });
    this.caricaAllenatori();
  }

  caricaAllenatori(): void {
    this.allenatoreService.getAll().subscribe(data => this.allenatori = data);
  }

  /**
   * Apre il form modale in modalità "Creazione" per inserire una nuova squadra,
   * resettando i campi del form ai valori iniziali.
   */
  creaNuovaSquadre(): void { 
    this.isEditMode = false;
    this.squadraForm = { nome: '', sport: '', campionato: '', allenatoreCf: '' };
    this.isSquadraModalOpen = true; 
  }

  /**
   * Apre il form modale in modalità "Modifica", popolando i campi
   * con i dati della squadra selezionata per l'aggiornamento.
   * 
   * @param sq I dati della squadra da modificare
   */
  modificaSquadra(sq: SquadraResponseDTO): void { 
    this.isEditMode = true;
    this.squadraSelezionataId = sq.id;
    this.squadraForm = {
      nome: sq.nome,
      sport: sq.sport,
      campionato: sq.campionato,
      allenatoreCf: sq.allenatoreCf
    };
    this.isSquadraModalOpen = true;
  }

  /**
   * Invia i dati della squadra al backend (tramite SquadraService).
   * Esegue una richiesta di creazione (POST) o modifica (PUT) a seconda
   * del flag `isEditMode`.
   */
  salvaSquadra(): void {
    if(!this.squadraForm.nome || !this.squadraForm.sport || !this.squadraForm.allenatoreCf) {
      alert('Compila tutti i campi obbligatori!');
      return;
    }
    
    if (this.isEditMode && this.squadraSelezionataId) {
      this.squadraService.update(this.squadraSelezionataId, this.squadraForm).subscribe({
        next: () => {
          alert('Squadra modificata con successo!');
          this.isSquadraModalOpen = false;
          this.caricaSquadre();
        },
        error: (err) => alert('Errore modifica: ' + (err.error?.message || ''))
      });
    } else {
      this.squadraService.create(this.squadraForm).subscribe({
        next: () => {
          alert('Squadra creata con successo!');
          this.isSquadraModalOpen = false;
          this.caricaSquadre();
        },
        error: (err) => alert('Errore creazione: ' + (err.error?.message || ''))
      });
    }
  }

  // GESTIONE ROSTER
  /**
   * Apre il modale del Roster relativo alla squadra selezionata
   * e ne innesca il caricamento asincrono degli atleti iscritti.
   * 
   * @param sq La squadra di cui visualizzare il roster
   */
  apriRoster(sq: SquadraResponseDTO): void {
    this.squadraRosterSelezionata = sq;
    this.nuovoAtletaCf = '';
    this.caricaRoster(sq.id);
  }

  /**
   * Recupera dal backend l'elenco degli atleti iscritti ad una determinata squadra.
   * 
   * @param id L'identificativo della squadra
   */
  caricaRoster(id: number): void {
    this.squadraService.getAtletiBySquadra(id).subscribe({
      next: (data) => {
        this.atletiRoster = data;
        this.isRosterModalOpen = true;
      },
      error: () => alert('Impossibile caricare il roster.')
    });
  }

  /**
   * Aggiunge un nuovo atleta alla squadra correntemente selezionata 
   * nel modale Roster, inviando il CF inserito al backend.
   */
  aggiungiAtleta(): void {
    if (!this.nuovoAtletaCf || !this.squadraRosterSelezionata) return;
    this.squadraService.addAtletaToSquadra(this.squadraRosterSelezionata.id, this.nuovoAtletaCf).subscribe({
      next: () => {
        alert('Atleta aggiunto con successo!');
        this.nuovoAtletaCf = '';
        this.apriRoster(this.squadraRosterSelezionata!); // Ricarica roster
      },
      error: (err: any) => alert('Impossibile aggiungere atleta: ' + (err.error?.message || err.error))
    });
  }

  /**
   * Rimuove un atleta dal roster della squadra corrente
   * previa conferma dell'utente.
   * 
   * @param cf Il codice fiscale dell'atleta da rimuovere
   */
  rimuoviAtleta(cf: string): void {
    if (!this.squadraRosterSelezionata) return;
    if(confirm('Rimuovere questo atleta dal roster?')) {
      this.squadraService.rimuoviAtletaDaSquadra(this.squadraRosterSelezionata.id, cf).subscribe({
        next: () => {
          alert('Atleta rimosso.');
          this.caricaRoster(this.squadraRosterSelezionata!.id);
        },
        error: () => alert('Impossibile rimuovere atleta.')
      });
    }
  }

  /**
   * Chiude sia il modale della gestione squadra che quello del Roster.
   */
  chiudiModali(): void {
    this.isSquadraModalOpen = false;
    this.isRosterModalOpen = false;
  }

  /**
   * Cancella definitivamente una squadra dal sistema tramite API.
   * L'operazione rimuoverà automaticamente a cascata tutte le associazioni nel DB.
   * 
   * @param id L'identificativo della squadra da eliminare
   */
  eliminaSquadra(id: number): void {
    if(confirm(`Sei sicuro di voler eliminare la squadra ID ${id}?`)) {
      this.squadraService.delete(id).subscribe({
        next: () => {
          alert(`Squadra ${id} eliminata.`);
          this.caricaSquadre();
        },
        error: (err) => alert('Errore eliminazione squadra: ' + (err.error?.message || ''))
      });
    }
  }
}