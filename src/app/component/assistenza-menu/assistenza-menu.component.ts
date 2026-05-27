import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SessionService } from '../../service/session.service';

@Component({
  selector: 'app-assistenza-menu',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './assistenza-menu.component.html',
  styleUrl: './assistenza-menu.component.scss'
})
export class AssistenzaMenuComponent implements OnInit {
  
  isLoggedIn: boolean = false;
  username: string = '';
  linkDestinazione: string = '/login'; // Default per gli ospiti

  constructor(private session: SessionService) {}

  ngOnInit(): void {
    const user = this.session.getLoggedUser();
    
    if (user) {
      this.isLoggedIn = true;
      this.username = (user as any).nome || user.username || user.email || 'Utente';
      
      // Trasforma tutto in minuscolo e toglie gli spazi vuoti prima e dopo la stringa
      const ruolo = user.tipoIscritto ? user.tipoIscritto.toLowerCase().trim() : 'atleta';

      console.log('Ruolo utente visto per il routing: ', ruolo); //DEBUG

      // CONTROLLO RIGIDO DEL RUOLO
      if (ruolo === 'admin' ) {
        this.linkDestinazione = '/area-personale/risolvi-assistenze';
      } else {
        this.linkDestinazione = '/area-personale/assistenza';
      }
    } else {
      this.isLoggedIn = false;
      this.linkDestinazione = '/login';
    }
  }
}