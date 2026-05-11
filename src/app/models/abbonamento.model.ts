export interface Abbonamento {
  numeroAbb?: number;
  dataInizio: string;
  tipoAbb: string;
  ingressi?: number;
  stato?: string;
  dataScadenza?: string;
}
