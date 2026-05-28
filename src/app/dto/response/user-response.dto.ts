/**
 * DTO principale di risposta con i dati anagrafici e il ruolo dell'utente loggato.
 * Restituito dai vari UserController/AtletaController e salvato nel SessionService.
 */
export interface UserResponseDTO {
    cf: string;
    nome: string;
    cognome: string;
    genere: string;
    dataNascita: string;
    cittaResidenza: string;
    username: string;
    email: string;
    tipoIscritto: string;
    scadenzaCertificato?: string;
    puntiGamification?: number;
}

export interface LoginResponseDTO {
    cf: string;
    nome: string;
    cognome: string;
    username: string;
    email: string;
    tipoIscritto: string;
    scadenzaCertificato?: string;
    puntiGamification?: number;
    messaggio: string;
}
