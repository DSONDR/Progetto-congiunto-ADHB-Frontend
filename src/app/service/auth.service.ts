import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequestDTO, RegisterRequestDTO } from '../dto/request/auth-request.dto';
import { LoginResponseDTO, UserResponseDTO } from '../dto/response/user-response.dto';

/**
 * auth.service.ts
 * Mapping API Backend invocati:
 * - login -> POST [Backend: AuthController]
 * - register -> POST [Backend: AuthController]
 * - deleteAccount -> DELETE [Backend: AuthController]
 */

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = '/api/auth';

  constructor(private http: HttpClient) {}

  login(request: LoginRequestDTO): Observable<LoginResponseDTO> {
    return this.http.post<LoginResponseDTO>(`${this.apiUrl}/login`, request);
  }

  register(request: RegisterRequestDTO): Observable<UserResponseDTO> {
    return this.http.post<UserResponseDTO>(`${this.apiUrl}/register`, request);
  }

  deleteAccount(cf: string): Observable<string> {
    // Restituisce stringa poichè backend restituisce ResponseEntity.noContent().build() o message
    return this.http.delete(`${this.apiUrl}/delete/${cf}`, { responseType: 'text' });
  }
}
