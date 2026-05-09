import { Squadra } from './squadra.model';
import { Impianto } from './impianto.model';

export interface Sponsor {

    id?: number;
    pIva: string;
    azienda: string;
    contatto: string;
    inizioContratto: string;
    fineContratto: string;

    squadre?: Squadra[];
    impianti?: Impianto[];

}