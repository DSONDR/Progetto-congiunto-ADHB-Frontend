import { Utente } from '../dto/utente.model';
import { Abbonamento } from './abbonamento.model';
import { Pagamento } from './pagamento.model';

export interface Sottoscrizione {
  id?: number;
  utente: Utente;
  abbonamento: Abbonamento;
  pagamento: Pagamento;
}
