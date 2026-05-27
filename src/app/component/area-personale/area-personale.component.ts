import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SessionService } from '../../service/session.service'; // Controlla il percorso del tuo servizio

@Component({
  selector: 'app-area-personale',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './area-personale.component.html',
  styleUrl: './area-personale.component.scss'
})
export class AreaPersonaleComponent implements OnInit {
  
  // Variabile che conterrà il ruolo dell'utente loggato
  ruoloUtente: string = 'atleta'; // Default di sicurezza

  constructor(private session: SessionService) {}

  ngOnInit(): void {
    const user = this.session.getLoggedUser(); 
    
    if (user && user.tipoIscritto) {
      this.ruoloUtente = user.tipoIscritto.toLowerCase().trim();
    } else {
      this.ruoloUtente = 'atleta'; 
    }
  }
}