import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  // Simuliamo il "flusso del dato" senza avere il backend pronto
  utenteLoggato = { nome: 'Ahmed Bini', foto: 'assets/profile.jpg', isLogged: true };
  
  eventiInEvidenza = [
    { id: 1, titolo: 'Torneo Calcetto', data: '12 Maggio' },
    { id: 2, titolo: 'Gara Nuoto', data: '15 Maggio' }
  ];
}
