import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SessionService } from '../../../service/session.service'; // Servizio sessione utente
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-cancella-profilo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cancella-profilo.component.html',
  styleUrl: './cancella-profilo.component.scss'
})
export class CancellaProfiloComponent {

  constructor(private session: SessionService, private router: Router, private authService: AuthService) {}

  // Azione collegata al tasto rosso "Cancellami"
  confermaCancellazione(): void {
    const utenteCorrente = this.session.getLoggedUser();
    // Verifica che l'utente sia loggato e i dati siano presenti prima di procedere
    if (utenteCorrente && utenteCorrente.cf) {
      this.authService.deleteAccount(utenteCorrente.cf).subscribe({
        next: () => {
          this.session.clearLoggedUser(); // Rimuove l'utente in sessione
          this.router.navigate(['/home']); // Riporta l'utente alla home page
        },
        error: (err) => {
          console.error('Errore durante la cancellazione:', err);
          alert('Si è verificato un errore durante la cancellazione del profilo.');
        }
      });
    } else {
      this.session.clearLoggedUser();
      this.router.navigate(['/home']);
    }
  }

  // Azione collegata al tasto "Annulla"
  annulla(): void {
    this.router.navigate(['/area-personale/benvenuto']); // Mette in sicurezza l'utente tornando a benvenuto
  }
}