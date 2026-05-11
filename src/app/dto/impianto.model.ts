import { Attivita } from './attivita.model';

export interface Impianto {

    id?: number;
    nomeI: string;
    tipoImpianto: string;
    statoI: string;
    omologazione: string;

    attivita?: Attivita[];

}