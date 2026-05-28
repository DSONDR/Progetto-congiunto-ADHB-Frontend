import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Richiesto per l'utilizzo delle funzionalità logiche nel template
import { RouterLink } from '@angular/router'; // Richiesto per i reindirizzamenti di pagina
import { SessionService } from '../../../service/session.service';
import { AtletaService } from '../../../service/atleta.service';
import { SottoscrizioneService } from '../../../service/sottoscrizione.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-attivita',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './attivita.component.html',
  styleUrl: './attivita.component.scss'
})
export class AttivitaComponent implements OnInit {

  /** 
   * Saldo punti attuale dell'atleta. 
   * Viene popolato in tempo reale dalla sessione. 
   */
  punteggioAttuale: number = 0;

  constructor(
    private sessionService: SessionService,
    private atletaService: AtletaService,
    private sottoscrizioneService: SottoscrizioneService
  ) { }

  // Eseguito all'avvio del componente, inizializza i dati o carica le risorse necessarie.
  ngOnInit() {
    const user = this.sessionService.getLoggedUser();
    // Verifica che l'utente sia loggato e i dati siano presenti prima di procedere
    if (user && user.puntiGamification) {
      this.punteggioAttuale = user.puntiGamification;
    }
  }

  /** Array degli oggetti premio disponibili nello store della gamification. */
  elencoPremi = [
    { id: 1, titolo: '1 mese gratis', sottoTitolo: 'Abbonamento a scelta', costo: 300, classeColore: 'card-verde' },
    { id: 2, titolo: '20 ingressi gratis', sottoTitolo: 'Pacchetto ricarica', costo: 150, classeColore: 'card-arancio' },
    { id: 3, titolo: '3 mesi gratis', sottoTitolo: 'Abbonamento a scelta', costo: 800, classeColore: 'card-viola' }
  ];

  /**
   * Tenta di riscattare un premio decurtando i punti.
   * Se i punti sono sufficienti, invoca il backend per decurtarli permanentemente.
   *
   * @param nomePremio Nome del premio visualizzato a schermo
   * @param costoPunti Il costo in punti Gamification del premio
   */
  riscattaPremio(nomePremio: string, costoPunti: number) {
    // Verifica che la lunghezza o il valore dei dati sia corretto prima di procedere
    if (this.punteggioAttuale >= costoPunti) {
      const user = this.sessionService.getLoggedUser();
      // Verifica che l'utente sia loggato e i dati siano presenti prima di procedere
      if (!user) return;

      this.atletaService.spendiPunti(user.cf, costoPunti).subscribe({
        next: (updatedUser) => {
          this.punteggioAttuale = updatedUser.puntiGamification || 0;
          // Aggiorna la sessione locale con i nuovi punti
          user.puntiGamification = this.punteggioAttuale;
          this.sessionService.setLoggedUser(user);

          // Registriamo l'abbonamento tramite il servizio Sottoscrizione
          // Nota: il titolo del premio deve corrispondere a un tipoAbbonamento reale 
          // nel database per funzionare.
          const req = {
            atletaCf: user.cf,
            tipoAbbonamento: nomePremio,
            metodo: 'PUNTI'
          };

          // Sottoscrive l'offerta (creazione abbonamento tramite punti)
          this.sottoscrizioneService.sottoscrivi(req).subscribe({
            next: (res) => {
              alert(`Fantastico! Hai sbloccato l'offerta: "${nomePremio}".\nIl tuo saldo residuo è di ${this.punteggioAttuale} punti.\n\nQuesta offerta verrà collegata al tuo account e potrai usarla nella sezione Abbonamenti!`);
            },
            error: (err) => {
              console.error(err);
              alert("Premio riscattato, ma errore nell'erogazione dell'abbonamento.");
            }
          });
        },
        error: (err) => {
          console.error(err);
          alert("Si è verificato un errore durante l'operazione. Riprova più tardi.");
        }
      });
    } else {
      alert(`Punti insufficienti per sbloccare "${nomePremio}".\nTi mancano ancora ${costoPunti - this.punteggioAttuale} punti!`);
    }
  }
}