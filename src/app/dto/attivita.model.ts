export interface Attivita {
  codiceAtt: number;
  nomeAtt: string;
  tipoEvento: string;
  destinatario: string;
  quotaBase?: number;
  dataOra: string;
  maxPartecipanti?: number;
  impianto?: any;
  squadre?: any[];
}
