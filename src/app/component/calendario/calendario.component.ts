import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SessionService } from '../../service/session.service';
import { IscrizioneService } from '../../service/iscrizione.service';
import { ImpiantoService, Impianto } from '../../service/impianto.service';
import { AttivitaService } from '../../service/attivita.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.scss'
})
export class CalendarioComponent implements OnInit {
  
  isLoggedIn: boolean = false;
  ruoloUtente: string = '';
  username: string = '';
  cfUtente: string = '';

  eventi: any[] = [];
  
  // Dati per i filtri
  impiantiDisponibili: Impianto[] = [];
  tipiEventoDisponibili: string[] = [];

  // Variabili ngModel filtri
  filtroDataInizio: string = ''; 
  filtroDataFine: string = '';
  filtroImpianto: string = 'Impianti';
  filtroTipo: string = 'Eventi';

  constructor(
    private session: SessionService,
    private iscrizioneService: IscrizioneService,
    private impiantoService: ImpiantoService,
    private attivitaService: AttivitaService
  ) {}

  ngOnInit(): void {
    const user = this.session.getLoggedUser();
    
    if (user) {
      this.isLoggedIn = true;
      this.username = user.username || user.nome;
      this.cfUtente = user.cf;
      this.ruoloUtente = user.tipoIscritto ? user.tipoIscritto.toLowerCase() : 'atleta';
      
      this.caricaFiltri();
      this.caricaEventi();
    } else {
      this.isLoggedIn = false;
    }
  }

  /**
   * Recupera gli elenchi dei filtri (sedi e tipi di eventi).
   */
  caricaFiltri(): void {
    this.impiantoService.getAll().subscribe(data => this.impiantiDisponibili = data);
    this.attivitaService.getTipiEvento().subscribe(data => this.tipiEventoDisponibili = data);
  }

  /**
   * Effettua una doppia chiamata API (forkJoin) per recuperare
   * sia le iscrizioni singole che gli utilizzi dell'abbonamento dell'utente.
   * Quindi sdoppia le attività per ogni data in cui si svolgono e popola l'array degli eventi.
   */
  caricaEventi(): void {
    if (this.ruoloUtente === 'istruttore' || this.ruoloUtente === 'allenatore') {
      this.attivitaService.filtra({ istruttoreCf: this.cfUtente }).subscribe(attivita => {
        this.eventi = [];
        attivita.forEach((att: any) => {
          if(att.dateOrari) {
            att.dateOrari.forEach((da: string) => {
              this.eventi.push({
                id: att.codiceAtt,
                data: da,
                impianto: att.impiantoNome || '',
                orario: new Date(da).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                tipo: att.tipoEvento,
                nomeAtt: att.nomeAtt,
                isSingola: false // Lo staff non si disiscrive da qua
              });
            });
          }
        });
        this.eventi.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
      });
    } else {
      // Il backend restituisce Iscrizione[] e UsaAbb[] per lo storico dell'utente
      forkJoin({
        singole: this.iscrizioneService.getStoricoUtente(this.cfUtente),
        conAbbonamento: this.iscrizioneService.getStoricoUsiAbbonamentoUtente(this.cfUtente)
      }).subscribe(({ singole, conAbbonamento }) => {
        this.eventi = [];
        
        // Mappiamo le iscrizioni singole
        singole.forEach((isc: any) => {
          // ogni attività può avere multiple date
          if(isc.attivita && isc.attivita.dateAtts) {
            isc.attivita.dateAtts.forEach((da: any) => {
              this.eventi.push({
                id: isc.attivita.codiceAtt,
                idPagamento: isc.pagamento?.idPagamento,
                data: da.date,
                impianto: isc.attivita.impianto?.nome || '',
                orario: new Date(da.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                tipo: isc.attivita.tipoEvento,
                nomeAtt: isc.attivita.nomeAtt,
                quotaBase: isc.attivita.quotaBase,
                importoPagato: isc.pagamento?.importo,
                isSingola: true
              });
            });
          }
        });

        // Mappiamo gli usi abbonamento
        conAbbonamento.forEach((uso: any) => {
          if(uso.attivita && uso.attivita.dateAtts) {
            uso.attivita.dateAtts.forEach((da: any) => {
              this.eventi.push({
                id: uso.attivita.codiceAtt,
                abbonamentoId: uso.abbonamento?.numeroAbb,
                data: da.date,
                impianto: uso.attivita.impianto?.nome || '',
                orario: new Date(da.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                tipo: uso.attivita.tipoEvento,
                nomeAtt: uso.attivita.nomeAtt,
                isSingola: false
              });
            });
          }
        });
        
        // Ordiniamo per data
        this.eventi.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
      });
    }
  }

  /**
   * Getter per l'elenco eventi filtrato. 
   * Restituisce una copia dell'array originario passando gli elementi
   * nei vari filtri Data, Impianto e Tipo selezionati nel template.
   */
  get eventiFiltrati() {
    return this.eventi.filter(ev => {
      let passaData = true;
      if (this.filtroDataInizio || this.filtroDataFine) {
        const dataEvento = new Date(ev.data);
        const dataInizio = this.filtroDataInizio ? new Date(this.filtroDataInizio) : null;
        const dataFine = this.filtroDataFine ? new Date(this.filtroDataFine) : null;

        if (dataInizio && dataEvento < dataInizio) passaData = false;
        if (dataFine && dataEvento > dataFine) passaData = false;
      } else {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        if (new Date(ev.data) < now) passaData = false;
      }

      const passaImpianto = (this.filtroImpianto === 'Impianti') || (ev.impianto === this.filtroImpianto);
      const passaTipo = (this.filtroTipo === 'Eventi') || (ev.tipo === this.filtroTipo);

      return passaData && passaImpianto && passaTipo;
    });
  }

  /**
   * Annulla una prenotazione (solo se singola).
   * Chiama il backend per la cancellazione e aggiorna la visualizzazione
   * in caso di esito positivo (che include controlli su limiti di tempo max).
   * 
   * @param evento L'evento da annullare
   */
  annullaPrenotazione(evento: any): void {
    if(!evento.isSingola) {
      alert("La disiscrizione da attività prenotate con abbonamento non è attualmente supportata.");
      return;
    }

    if(confirm(`Sei sicuro di voler annullare l'iscrizione a ${evento.nomeAtt}?`)) {
      this.iscrizioneService.cancellaIscrizione(evento.id, evento.idPagamento, this.cfUtente).subscribe({
        next: () => {
          alert(`Iscrizione annullata. È stato disposto il rimborso (mock). I punti gamification sono stati decurtati.`);
          
          const user = this.session.getLoggedUser();
          if (user && evento.importoPagato) {
             const puntiDaTogliere = Math.floor(evento.importoPagato);
             user.puntiGamification = Math.max(0, (user.puntiGamification || 0) - puntiDaTogliere);
             this.session.setLoggedUser(user);
          }
          
          this.caricaEventi(); // Ricarica
        },
        error: (err) => {
          alert(`Errore: Impossibile annullare l'iscrizione. ${err.error?.message || ''}`);
        }
      });
    }
  }

  /**
   * Verifica se è possibile annullare l'iscrizione (almeno 24h prima)
   */
  canAnnullare(evento: any): boolean {
    if (!evento.isSingola) return false;
    const now = new Date();
    const eventDate = new Date(evento.data);
    const diffHours = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffHours >= 24;
  }
}