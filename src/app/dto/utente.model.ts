export interface Utente {
  codiceFiscale: string;
  nome: string;
  cognome: string;
  username: string;
  email: string;
  genere: string;
  dataNascita: Date;
  cittaResidenza: string;
  password: string;		//ci va o no?
  stipendio: number;		// Può essere null
  tipoVisita: string;
  emissioneVisita: string;
  scadenzaVisita: string;
  medicoRiferimento: string;
}
