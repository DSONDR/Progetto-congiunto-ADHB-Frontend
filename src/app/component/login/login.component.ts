import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SessionService } from '../../service/session.service';
import { AuthService } from '../../service/auth.service';
import { LoginRequestDTO } from '../../dto/request/auth-request.dto';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  //Modello dati vuoto per bindare i campi del form di login
  loginData = {
    username: '',
    password: ''
  };

  constructor(private router: Router, private session: SessionService, private authService: AuthService) { }

  // Gestisce la logica di eseguiLogin nel componente.
  eseguiLogin() {
    const request: LoginRequestDTO = {
      email: this.loginData.username, // Assumiamo che l'utente inserisca l'email nel campo username per il momento (oppure andrebbe rinominato in UI)
      password: this.loginData.password
    };

    // Effettua la chiamata API di login verso il backend delegando al servizio di autenticazione
    this.authService.login(request).subscribe({
      next: (response) => {
        // Se il login va a buon fine, salviamo l'utente
        this.session.setLoggedUser(response as any); // Il backend ci restituisce il LoginResponseDTO
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Errore durante il login:', err);
        alert('Credenziali errate o utente inesistente!');
      }
    });
  }
}