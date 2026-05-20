import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
// Ipotetico componente di login (lo creeremo in futuro)
// import { LoginComponent } from './features/auth/login.component'; 

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  // Prepariamo i "buchi" per i futuri link del menu
  { path: 'eventi', component: HomeComponent },
  { path: 'calendario', component: HomeComponent },
  { path: 'abbonamenti', component: HomeComponent },
  { path: 'assistenza', component: HomeComponent },
  { path: 'login', component: HomeComponent }, // Placeholder temporaneo: qui andrà la pagina di login vera
  { path: 'area-personale', component: HomeComponent }
];