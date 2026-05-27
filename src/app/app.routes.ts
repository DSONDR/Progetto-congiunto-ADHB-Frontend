import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
// Ipotetico componente di login (lo creeremo in futuro)
import { LoginComponent } from './component/login/login.component'; 
import { RegistrazioneComponent } from './component/registrazione/registrazione.component';
import { AreaPersonaleComponent } from './component/area-personale/area-personale.component';
// Rotta dashboard comune, cliccando su nome post login
import { BenvenutoComponent } from './component/area-personale/benvenuto/benvenuto.component'; 
// Rotte uniche dashboard Istruttore
import { AssistenzaComponent } from './component/area-personale/assistenza/assistenza.component';
import { AbbonamentiComponent } from './component/area-personale/abbonamenti/abbonamenti.component';
import { AttivitaComponent } from './component/area-personale/attivita/attivita.component';
import { SquadreComponent } from './component/area-personale/squadre/squadre.component';
import { LogoutComponent } from './component/area-personale/logout/logout.component';
import { CancellaProfiloComponent } from './component/area-personale/cancella-profilo/cancella-profilo.component';
// Rotte uniche dashboard Istruttore
import { CorsiIstruttoreComponent } from './component/area-personale/corsi-istruttore/corsi-istruttore.component';
import { RisolviAssistenzeComponent } from './component/area-personale/risolvi-assistenze/risolvi-assistenze.component';
// Rotte uniche dashboard Allenatore
import { AllenamentiAllenatoreComponent } from './component/area-personale/allenamenti-allenatore/allenamenti-allenatore.component';
// Rotte uniche dashboard Admin
import { GestioneAttivitaComponent } from './component/area-personale/gestione-attivita/gestione-attivita.component';
import { GestioneImpiantiComponent } from './component/area-personale/gestione-impianti/gestione-impianti.component';
import { GestioneUtentiComponent } from './component/area-personale/gestione-utenti/gestione-utenti.component';
import { GestioneSquadreComponent } from './component/area-personale/gestione-squadre/gestione-squadre.component';
import { GestioneSponsorComponent } from './component/area-personale/gestione-sponsor/gestione-sponsor.component';
//Altre rotte menù di navigazione
import { CalendarioComponent } from './component/calendario/calendario.component';
import { EventiComponent } from './component/eventi/eventi.component';
import { AssistenzaMenuComponent } from './component/assistenza-menu/assistenza-menu.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  //Percorsi reali di routing
  { path: 'login', component: LoginComponent },
  { path: 'registrazione', component: RegistrazioneComponent },
  //Dashboard area personale, divisa per utenti
  { path: 'area-personale', component: AreaPersonaleComponent, children: [
        // Pagina di default, con *ngIf per diversificare menù e possibilità per tipo utente
        { path: '', redirectTo: 'benvenuto', pathMatch: 'full'},
        { path: 'benvenuto', component: BenvenutoComponent },
        // Pagine della dashboard dell'atleta
        { path: 'assistenza', component: AssistenzaComponent },
        { path: 'abbonamenti', component: AbbonamentiComponent },
        { path: 'attivita', component: AttivitaComponent }, 
        { path: 'squadre', component: SquadreComponent },
        { path: 'logout', component: LogoutComponent },
        { path: 'cancella-profilo', component: CancellaProfiloComponent },
        // Pagine della dashboard dell'istruttore, solo quelle nuove vs sopra
        { path: 'corsi-istruttore', component: CorsiIstruttoreComponent },
        { path: 'risolvi-assistenze', component: RisolviAssistenzeComponent },
        // Pagine uniche dashboard Allenatore
        { path: 'allenamenti-allenatore', component: AllenamentiAllenatoreComponent },
        // Pagine uniche dashboard Admin
        { path: 'gestione-attivita', component: GestioneAttivitaComponent },
        { path: 'gestione-impianti', component: GestioneImpiantiComponent },
        { path: 'gestione-utenti', component: GestioneUtentiComponent },
        { path: 'gestione-squadre', component: GestioneSquadreComponent },
        { path: 'gestione-sponsor', component: GestioneSponsorComponent }   
    ]
  },
  //Altre voci menù per tutti
  { path: 'calendario', component: CalendarioComponent },
  { path: 'eventi', component: EventiComponent },
  { path: 'assistenza-menu', component: AssistenzaMenuComponent },
  // Prepariamo i "buchi" per i futuri link del menu
  { path: 'abbonamenti', component: HomeComponent },
];