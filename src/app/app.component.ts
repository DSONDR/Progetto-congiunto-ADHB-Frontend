import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import {SampleEntitiesComponent} from './component/sample-entities/sample-entities.component';
// 1. Importa il tuo nuovo componente (controlla che il percorso sia corretto)
import { UtentiComponent } from './component/utenti/utenti.component';

@Component({
  selector: 'app-root',
  // 2. Aggiungi UtentiComponent all'array degli imports
  standalone: true,
  imports: [RouterOutlet, RouterLink, UtentiComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
}