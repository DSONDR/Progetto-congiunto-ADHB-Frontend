import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
// Importa i service necessari per le conversazioni
import { SessionService } from './service/session.service';
import { Utente } from './dto/utente.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  loggedUser: Utente | null = null;  // Mappa il nostro Utente come nel db, grazie alla verifica sotto

  constructor(private session: SessionService, private router: Router) {}

  ngOnInit(): void {  //Verifico che ci sia un utente loggato all'avvio dell'app
    this.loggedUser=this.session.getLoggedUser();
  }

  // Funzione che verifica se siamo sulla home page, per mostrare o nascondere il menu di navigazione
  isHomeActive(): boolean {
    return this.router.url === '/home' || this.router.url === '/';
  }
}