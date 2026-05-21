import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
// Ipotetico componente di login (lo creeremo in futuro)
import { LoginComponent } from './component/login/login.component'; 
import { RegistrazioneComponent } from './component/registrazione/registrazione.component'; 


export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  //Percorsi reali di routing
  { path: 'login', component: LoginComponent },
  { path: 'registrazione', component: RegistrazioneComponent },
  // Prepariamo i "buchi" per i futuri link del menu
  { path: 'eventi', component: HomeComponent },
  { path: 'calendario', component: HomeComponent },
  { path: 'abbonamenti', component: HomeComponent },
  { path: 'assistenza', component: HomeComponent },
  { path: 'area-personale', component: HomeComponent }
];