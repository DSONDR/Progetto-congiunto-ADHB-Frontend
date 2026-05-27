import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UtenteService } from '../../../service/utente.service';
import { IstruttoreService } from '../../../service/istruttore.service';
import { AllenatoreService } from '../../../service/allenatore.service';
import { AuthService } from '../../../service/auth.service';
import { UserResponseDTO } from '../../../dto/response/user-response.dto';
import { forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-gestione-utenti',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestione-utenti.component.html',
  styleUrl: './gestione-utenti.component.scss'
})
export class GestioneUtentiComponent implements OnInit {

  personale: UserResponseDTO[] = [];
  atleti: UserResponseDTO[] = [];

  mostraStaff: boolean = true;
  isModalOpen: boolean = false;
  isEditMode: boolean = false;
  utenteSelezionatoCf: string | null = null;
  utenteForm: any = {
    cf: '', nome: '', cognome: '', email: '', password: '',
    dataNascita: '', cittaResidenza: '', genere: 'M',
    scadenzaCertificato: '',
    tipoIscritto: 'Atleta', specializzazione: '', grado: ''
  };

  constructor(
    private atletaService: UtenteService,
    private istruttoreService: IstruttoreService,
    private allenatoreService: AllenatoreService,
    private authService: AuthService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.caricaUtenti();
  }

  /**
   * Recupera tramite servizi dedicati sia gli Atleti che lo Staff (Istruttori e Allenatori),
   * utilizzando forkJoin per il caricamento parallelo dello staff.
   */
  caricaUtenti(): void {
    this.atletaService.getAll().subscribe(data => {
      // Escludiamo il personale dalla lista degli atleti
      this.atleti = data.filter(u =>
        u.tipoIscritto !== 'ISTRUTTORE' &&
        u.tipoIscritto !== 'ALLENATORE' &&
        u.tipoIscritto !== 'ADMIN'
      );
    });

    forkJoin({
      istruttori: this.istruttoreService.getAll(),
      allenatori: this.allenatoreService.getAll()
    }).subscribe(({ istruttori, allenatori }) => {
      this.personale = [...istruttori, ...allenatori];
    });
  }

  /**
   * Alterna la visualizzazione nella tabella tra Staff (Istruttori/Allenatori) e Atleti.
   */
  toggleVistaUtenti(): void {
    this.mostraStaff = !this.mostraStaff;
  }

  /**
   * Pre-popola il form modale con i dati dell'utente selezionato per l'aggiornamento.
   * Gestisce il parsing delle date per la compatibilità con i campi input date.
   * 
   * @param utente I dati dell'utente da modificare
   */
  modificaUtente(utente: any): void {
    this.isEditMode = true;
    this.utenteSelezionatoCf = utente.cf;
    this.utenteForm = { ...utente };
    // Formatta le date per gli input HTML se necessario (dipende da come arrivano)
    if (this.utenteForm.dataNascita && this.utenteForm.dataNascita.includes('T')) {
      this.utenteForm.dataNascita = this.utenteForm.dataNascita.split('T')[0];
    }
    if (this.utenteForm.scadenzaCertificato && this.utenteForm.scadenzaCertificato.includes('T')) {
      this.utenteForm.scadenzaCertificato = this.utenteForm.scadenzaCertificato.split('T')[0];
    }
    this.isModalOpen = true;
  }

  /**
   * Inizializza il form modale in modalità "Creazione" resettando i campi
   * ai loro valori predefiniti o vuoti.
   */
  inserisciNuovoUtente(): void {
    this.isEditMode = false;
    this.utenteSelezionatoCf = null;
    this.utenteForm = {
      cf: '', nome: '', cognome: '', email: '', password: '',
      dataNascita: '', cittaResidenza: '', genere: 'M',
      scadenzaCertificato: '',
      tipoIscritto: 'Atleta', specializzazione: '', grado: ''
    };
    this.isModalOpen = true;
  }

  /**
   * Chiude il form modale senza salvare i dati.
   */
  chiudiModale(): void {
    this.isModalOpen = false;
  }

  /**
   * Invia i dati inseriti o modificati nel form al backend.
   * Smista automaticamente la richiesta di creazione/modifica al Service appropriato
   * (IstruttoreService, AllenatoreService o AuthService per gli atleti)
   * in base al `tipoIscritto` selezionato nel form.
   */
  salvaUtente(): void {
    if (!this.utenteForm.cf || !this.utenteForm.nome || !this.utenteForm.cognome || !this.utenteForm.email) {
      alert('Compila tutti i campi anagrafici obbligatori!');
      return;
    }
    if (this.utenteForm.cf.length !== 16) {
      alert('Il Codice Fiscale deve essere esattamente di 16 caratteri.');
      return;
    }
    if (this.utenteForm.password && this.utenteForm.password.length < 8) {
      alert('La password, se inserita, deve contenere almeno 8 caratteri.');
      return;
    }

    const tipo = this.utenteForm.tipoIscritto;

    let obs$;
    if (tipo === 'Atleta' && !this.isEditMode) {
      if (!this.utenteForm.dataNascita) this.utenteForm.dataNascita = '1990-01-01';
      if (!this.utenteForm.cittaResidenza) this.utenteForm.cittaResidenza = 'Sconosciuta';
      if (!this.utenteForm.genere) this.utenteForm.genere = 'M';

      // Per gli atleti usiamo la rotta di auth /register che fa da proxy (non c'è un AtletaController create)
      const regDto = {
        cf: this.utenteForm.cf, nome: this.utenteForm.nome, cognome: this.utenteForm.cognome,
        genere: this.utenteForm.genere, dataNascita: this.utenteForm.dataNascita,
        cittaResidenza: this.utenteForm.cittaResidenza, username: this.utenteForm.email.split('@')[0],
        email: this.utenteForm.email, password: this.utenteForm.password || 'Password123!'
      };
      obs$ = this.authService.register(regDto);
    } else if (tipo === 'Istruttore') {
      this.utenteForm.username = this.utenteForm.email.split('@')[0];
      if (!this.utenteForm.password) this.utenteForm.password = 'Password123!';
      if (!this.utenteForm.specializzazione) this.utenteForm.specializzazione = 'Generica';
      if (!this.utenteForm.dataNascita) this.utenteForm.dataNascita = '1990-01-01';
      if (!this.utenteForm.cittaResidenza) this.utenteForm.cittaResidenza = 'Sconosciuta';
      if (!this.utenteForm.genere) this.utenteForm.genere = 'M';
      obs$ = this.isEditMode ? this.istruttoreService.update(this.utenteForm.cf, this.utenteForm) : this.istruttoreService.create(this.utenteForm);
    } else if (tipo === 'Allenatore') {
      this.utenteForm.username = this.utenteForm.email.split('@')[0];
      if (!this.utenteForm.password) this.utenteForm.password = 'Password123!';
      if (!this.utenteForm.grado || isNaN(Number(this.utenteForm.grado))) this.utenteForm.grado = 1;
      if (!this.utenteForm.dataNascita) this.utenteForm.dataNascita = '1990-01-01';
      if (!this.utenteForm.cittaResidenza) this.utenteForm.cittaResidenza = 'Sconosciuta';
      if (!this.utenteForm.genere) this.utenteForm.genere = 'M';
      obs$ = this.isEditMode ? this.allenatoreService.update(this.utenteForm.cf, this.utenteForm) : this.allenatoreService.create(this.utenteForm);
    } else {
      alert('Modifica Atleti o Admin diretti da implementare separatamente o non permessa in questo form base.');
      return;
    }

    obs$.subscribe({
      next: () => {
        alert('Utente salvato con successo!');
        this.isModalOpen = false;
        this.caricaUtenti();
      },
      error: (err: any) => alert('Errore durante il salvataggio: ' + (err.error?.message || ''))
    });
  }

  /**
   * Elimina fisicamente l'utente dal sistema richiamando l'API centralizzata
   * di cancellazione account (/api/auth/delete/{cf}), la quale si occupa di 
   * cancellare a cascata eventuali record collegati nel backend.
   * 
   * @param cf Il codice fiscale dell'utente da eliminare
   */
  eliminaUtente(cf: string): void {
    if (confirm(`Sicuro di voler revocare l'accesso ed eliminare l'utente CF ${cf}? L'operazione è irreversibile e cancellerà a cascata i dati ad esso collegati.`)) {
      // La chiamata generica di cancellazione per CF dal sistema
      this.http.delete(`/api/auth/delete/${cf}`).subscribe({
        next: () => {
          alert('Utente cancellato con successo.');
          this.caricaUtenti();
        },
        error: (err) => alert('Errore durante la cancellazione dell\'utente. ' + (err.error?.message || ''))
      });
    }
  }
}