import { Allenatore } from './allenatore.model';
import { Atleta } from './atleta.model';

export interface Squadra {
  id?: number;
  nome: string;
  sport: string;
  campionato: string;
  allenatore?: Allenatore; // L'oggetto completo dal BE
  atleti?: Atleta[];       // La lista dei componenti
}
