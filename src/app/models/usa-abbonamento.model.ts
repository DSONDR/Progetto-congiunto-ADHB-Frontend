import { Sottoscrizione } from './sottoscrizione.model';
import { Attivita } from './attivita.model';

export interface UsaAbbonamento {
  id?: number;
  sottoscrizione: Sottoscrizione;
  attivita: Attivita;
  dataUtilizzo?: string;
}
