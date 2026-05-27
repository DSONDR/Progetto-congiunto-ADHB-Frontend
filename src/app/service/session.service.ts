import { Injectable } from '@angular/core';
import { UserResponseDTO } from '../dto/response/user-response.dto';
import { BehaviorSubject, Observable } from 'rxjs'; // Importiamo gli strumenti di RxJS

@Injectable({ providedIn: 'root' })
export class SessionService {
  // Creiamo il flusso reattivo specchio del localStorage
  private loggedUserSubject = new BehaviorSubject<UserResponseDTO | null>(this.getLoggedUserFromStorage());

  // Funzione di utility interna privata per leggere il localStorage all'avvio
  private getLoggedUserFromStorage(): UserResponseDTO | null {
    const raw = localStorage.getItem('utente');
    return raw ? (JSON.parse(raw) as UserResponseDTO) : null;
  }

  // Mettiamo il flusso a disposizione dei componenti in modalità "sola lettura" (Observable)
  get loggedUser$(): Observable<UserResponseDTO | null> {
    return this.loggedUserSubject.asObservable();
  }

  // Questo metodo serve per prendere al volo il valore corrente senza iscriversi
  getLoggedUser(): UserResponseDTO | null {
    return this.loggedUserSubject.value;
  }

  setLoggedUser(user: UserResponseDTO): void {
    localStorage.setItem('utente', JSON.stringify(user));
    this.loggedUserSubject.next(user); // Avvisiamo tutti i componenti che l'utente è cambiato!
  }

  clearLoggedUser(): void {
    localStorage.removeItem('utente');
    this.loggedUserSubject.next(null); // Avvisiamo tutti i componenti che l'utente si è scollegato!
  }
}