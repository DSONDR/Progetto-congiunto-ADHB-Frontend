import { SquadraResponseDTO } from './squadra-response.dto';

export interface AttivitaResponseDTO {
    codiceAtt: number;
    nomeAtt: string;
    tipoEvento: string;
    destinatario: string;
    quotaBase: number;
    maxPartecipanti: number;
    istruttoreCf: string;
    nomeIstruttore: string;
    impiantoNome: string;
    impiantoId: number;
    dateOrari: string[];
    squadreAderenti: SquadraResponseDTO[];
    descrizione?: string;
    iscritti?: number;
}
