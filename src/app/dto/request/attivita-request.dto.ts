/**
 * DTO per la creazione o l'aggiornamento dei dati di un'attività (es. evento, corso).
 * Inviato da AttivitaService al backend AttivitaGestioneController.
 */
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
