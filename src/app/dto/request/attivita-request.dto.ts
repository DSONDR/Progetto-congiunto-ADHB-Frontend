export interface AttivitaRequestDTO {
    codiceAtt?: number;
    nomeAtt?: string;
    tipoEvento?: string;
    destinatario?: string;
    quotaBase?: number;
    maxPartecipanti?: number;
    istruttoreCf?: string;
    impiantoId?: number;
    dateOrari?: string[];
    squadreIds?: number[];
    descrizione?: string;
}
