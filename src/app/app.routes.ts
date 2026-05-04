import { Routes } from '@angular/router';
import {SampleEntitiesComponent} from './component/sample-entities/sample-entities.component';
import {UtentiComponent} from './component/utenti/utenti.component';
import {AtletiComponent} from './component/atleti/atleti.component';
import {AllenatoriComponent} from './component/allenatori/allenatori.component';
import {IstruttoriComponent} from './component/istruttori/istruttori.component';
import {HomeComponent} from './component/home/home.component';
import {SquadraComponent} from './component/squadra/squadra.component';


export const routes: Routes = [
  { path: 'squadre', component: SquadraComponent},
  { path: 'sample-entities', component: SampleEntitiesComponent },
  { path: 'home', component: HomeComponent },
  { path: 'utenti', component: UtentiComponent },
  { path: 'atleti', component: AtletiComponent },
  { path: 'allenatori', component: AllenatoriComponent },
  { path: 'istruttori', component: IstruttoriComponent },
  { path: '', redirectTo: '/utenti', pathMatch:'full'} //Pagina di default per cosa?
];

