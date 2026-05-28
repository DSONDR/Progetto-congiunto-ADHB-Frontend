import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Necessario per il [(ngModel)]
import { Router } from '@angular/router';
import { SessionService } from '../../service/session.service';
import { AuthService } from '../../service/auth.service';
import { RegisterRequestDTO } from '../../dto/request/auth-request.dto';

@Component({
  selector: 'app-registrazione',
  standalone: true,
  imports: [FormsModule], // Importiamo FormsModule per i form
  templateUrl: './registrazione.component.html',
  styleUrls: ['./registrazione.component.scss']
})
export class RegistrazioneComponent {
  /**
   * Oggetto bindato al form HTML tramite ngModel.
   * Contiene i dati necessari per creare un nuovo utente.
   */
  registrazioneData = {
    email: '',
    username: '',
    password: '',
    nome: '',
    cognome: '',
    cf: '',
    genere: '',
    dataNascita: '',
    cittaResidenza: '',
    acconsento: false
  };

  constructor(private router: Router, private session: SessionService, private authService: AuthService) { }

  /**
   * Esegue la registrazione di un nuovo utente.
   * Valida i campi del form (obbligatorietà e lunghezza CF),
   * prepara il DTO e invoca il backend.
   * Se ha successo, esegue il login automatico salvando i dati nella sessione e rimanda alla home.
   */
  eseguiRegistrazione() {
    // Validazione base
    const d = this.registrazioneData;
    // Verifica che l'utente sia loggato e i dati siano presenti prima di procedere
    if (!d.email || !d.username || !d.password || !d.nome || !d.cognome || !d.cf || !d.genere || !d.dataNascita || !d.cittaResidenza) {
      alert('Tutti i campi sono obbligatori!');
      return;
    }
    // Verifica che la lunghezza o il valore dei dati sia corretto prima di procedere
    if (d.cf.length !== 16) {
      alert('Il codice fiscale deve essere di 16 caratteri!');
      return;
    }
    // Aggiungi altre validazioni campi registrazione

    // Verifica che i parametri richiesti siano presenti e validi prima di procedere
    if (this.registrazioneData.acconsento) {
      // Prepariamo il payload per la registrazione
      const request: RegisterRequestDTO = {
        cf: this.registrazioneData.cf,
        nome: this.registrazioneData.nome,
        cognome: this.registrazioneData.cognome,
        genere: this.registrazioneData.genere,
        dataNascita: this.registrazioneData.dataNascita, // Assumiamo sia nel formato YYYY-MM-DD
        cittaResidenza: this.registrazioneData.cittaResidenza,
        username: this.registrazioneData.username,
        email: this.registrazioneData.email,
        password: this.registrazioneData.password
      };

      // Invia la request tramite AuthService e si iscrive per attendere la risposta
      this.authService.register(request).subscribe({
        next: (response) => {
          // Usiamo i dati appena inseriti/risposti dal backend per creare la sessione
          this.session.setLoggedUser(response as any);
          this.router.navigate(['/home']); // Ritorno alla home
        },
        error: (err) => {
          console.error('Errore durante la registrazione:', err);
          let errorMessage = "Controlla i dati o se l'utente esiste già.";
          // Verifica che i parametri richiesti siano presenti e validi prima di procedere
          if (err.error?.message) {
            errorMessage = err.error.message;
          } else if (typeof err.error === 'string') {
            errorMessage = err.error;
          }
          alert('Errore nella registrazione: ' + errorMessage);
        }
      });
    } else { // Blocca la registrazione se l'utente non spunta la checkbox sulla privacy
      alert('Devi accettare il trattamento dei dati!');
    }
  }
}