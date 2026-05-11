import { Utente } from '../dto/utente.model';
import { Attivita } from './attivita.model';
import { Pagamento } from './pagamento.model';

export interface Iscrizione {
  id?: number;
  utente: Utente;
  attivita: Attivita;
  pagamento: Pagamento;
  dataRegistrazione?: string;
}
