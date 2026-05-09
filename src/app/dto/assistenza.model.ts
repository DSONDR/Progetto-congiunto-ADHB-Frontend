import { Utente } from './utente.model';

export interface Assistenza {

    idTicket?: number;
    tipoAss: string;
    oggetto: string;
    stato: string;
    soddisfazione: string;

    utente?: Utente;

}