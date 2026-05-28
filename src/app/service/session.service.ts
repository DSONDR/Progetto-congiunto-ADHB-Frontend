import { Injectable } from '@angular/core';
import { UserResponseDTO } from '../dto/response/user-response.dto';
import { BehaviorSubject, Observable } from 'rxjs'; // Importiamo gli strumenti di RxJS

/**
 * session.service.ts
 * Sostituisce Spring Security/JWT, basandosi sul localStorage per mantenere loggato l'utente.
 * Invocato da quasi tutti i componenti (navbar, login, dashboard, ecc.).
 */
@Injectable({ providedIn: 'root' })
export class SessionService {
  // Creiamo il flusso reattivo specchio del localStorage
  private loggedUserSubject = new BehaviorSubject<UserResponseDTO | null>(this.getLoggedUserFromStorage());

  // Funzione di utility interna privata per leggere il localStorage all'avvio del componente
  private getLoggedUserFromStorage(): UserResponseDTO | null {
    const raw = localStorage.getItem('utente');
    return raw ? (JSON.parse(raw) as UserResponseDTO) : null;
  }

  // Restituisce il flusso reattivo asincrono dell'utente loggato. Utilizzato per iscrizioni nel template (es. navbar *ngIf="loggedUser$ | async")
  get loggedUser$(): Observable<UserResponseDTO | null> {
    return this.loggedUserSubject.asObservable();
  }

  // Restituisce l'utente correntemente loggato in maniera sincrona. Utilizzato nei Service/Component prima di chiamate API
  getLoggedUser(): UserResponseDTO | null {
    return this.loggedUserSubject.value;
  }

  // Salva l'utente nel localStorage e propaga l'evento ai subscriber. Utilizzato dopo Login e per aggiornare i punti gamification
  setLoggedUser(user: UserResponseDTO): void {
    localStorage.setItem('utente', JSON.stringify(user));
    this.loggedUserSubject.next(user); // Avvisiamo tutti i componenti che l'utente è cambiato!
  }

  // Rimuove l'utente dal localStorage e propaga null. Utilizzato dal LogoutComponent
  clearLoggedUser(): void {
    localStorage.removeItem('utente');
    this.loggedUserSubject.next(null); // Avvisiamo tutti i componenti che l'utente si è scollegato!
  }
}