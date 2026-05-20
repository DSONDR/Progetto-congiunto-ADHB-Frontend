// ===== File: servizi/session.service.ts =====
import { Injectable } from '@angular/core';
import { Utente } from '../dto/utente.model';

@Injectable({ providedIn: 'root' })
export class SessionService {

  getLoggedUser(): Utente | null {
    const raw = localStorage.getItem('utente');
    return raw ? JSON.parse(raw) as Utente : null;
  }

  setLoggedUser(user: Utente): void {
    localStorage.setItem('utente', JSON.stringify(user));
  }

  clearLoggedUser(): void {
    localStorage.removeItem('utente');
  }

}
