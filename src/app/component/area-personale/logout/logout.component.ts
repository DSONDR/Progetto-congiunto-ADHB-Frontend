import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SessionService } from '../../../service/session.service'; // Servizio sessione utente

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent {
  
  constructor(private session: SessionService, private router: Router) {}

  // Azione collegata al tasto "Si, Logout"
  confermaLogout(): void {
    this.session.clearLoggedUser(); // Svuota il localStorage e aggiorna la navbar
    this.router.navigate(['/home']); // Torna alla home principale del sito
  }

  // Azione collegata al tasto "Annulla"
  annulla(): void {
    this.router.navigate(['/area-personale/benvenuto']); // Ritorna alla schermata iniziale anagrafica
  }
}