import { Utente } from './utente.model';

export interface Istruttore extends Utente {
	specializzazione: string;
}
