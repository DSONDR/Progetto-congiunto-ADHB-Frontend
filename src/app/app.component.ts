import { Component,OnInit,OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { Subscription } from 'rxjs'; //Ripulisce memoria quando chiudiamo
// Importa i service necessari per le conversazioni
import { SessionService } from './service/session.service';
import { UserResponseDTO } from './dto/response/user-response.dto';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy{
  loggedUser: UserResponseDTO | null = null;  // Mappa il nostro Utente come nel db, grazie alla verifica sotto
  private sub: Subscription = new Subscription(); // Per gestire ascolti

  constructor(private session: SessionService, private router: Router) {}

  ngOnInit(): void {
    // Ci mettiamo in ascolto del flusso del SessionService
    this.sub = this.session.loggedUser$.subscribe(user => {
      this.loggedUser = user; // Appena fa il login la variabile user cambia
    })
  }

  // Funzione che verifica se siamo sulla home page, per mostrare o nascondere il menu di navigazione
  isHomeActive(): boolean {
    return this.router.url === '/home' || this.router.url === '/';
  }

  // Funzione che controlla se siamo nella dash, per nascondere la nav bar e il logo
  isDashboardActive(): boolean {
    return this.router.url.includes('/area-personale');
  }

  isCalendarioActive(): boolean {
    return this.router.url.includes('/calendario');
  }

  // Aggiungi questa funzione insieme alle altre (isDashboardActive, isCalendarioActive, ecc.)
  isEventiActive(): boolean {
    return this.router.url.includes('/eventi');
  }

  isAssistenzaMenuActive(): boolean {
    return this.router.url.includes('/assistenza-menu'); 
  }

  //Spegnamo ascolto alla chiusura
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}