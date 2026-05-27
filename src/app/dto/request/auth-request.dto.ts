export interface LoginRequestDTO {
    email?: string;
    password?: string;
}

export interface RegisterRequestDTO {
    cf?: string;
    nome?: string;
    cognome?: string;
    genere?: string;
    dataNascita?: string;
    cittaResidenza?: string;
    username?: string;
    email?: string;
    password?: string;
}
