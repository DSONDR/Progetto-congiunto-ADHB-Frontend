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
