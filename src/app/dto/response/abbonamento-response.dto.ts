/**
 * Rappresenta i dettagli di un Tipo di Abbonamento (es. Mensile, Annuale, Pilates).
 * Scambiato tra `AbbonamentoController` (Backend) e `AbbonamentoService` (Frontend).
 */
export interface TipoAbbonamentoDTO {
    nome: string;
    tipo: string;
    prezzo: number;
    durataMesi: number;
    maxIngressi: number;
}

/**
 * Rappresenta l'entità Sottoscrizione (acquisto di un abbonamento).
 * Usato nello storico acquisti. Scambiato tra `SottoscrizioneController` e `SottoscrizioneService`.
 */
export interface Sottoscrizione {
    numeroAbb: number;
    dataInizio: string;
    dataScadenza: string;
    tipoAbb: string;
    ingressi: number;
    stato: string;
    atletaCf?: string;
    idPagamento?: number;
}

/**
 * Risposta dopo un acquisto (sottoscrizione). Contiene la Sottoscrizione creata e un eventuale avviso.
 * Restituito da `SottoscrizioneController.sottoscrivi` e consumato da `SottoscrizioneService.sottoscrivi`.
 */
export interface SottoscrizioneResponseDTO {
    sottoscrizione: Sottoscrizione;
    avviso: string | null;
}

/**
 * Rappresenta l'abbonamento attivo (o scaduto) di un utente, con date e stato.
 * Scambiato tra `SottoscrizioneController.getAbbonamentiAtleta` e `SottoscrizioneService.getAbbonamentiAtleta`.
 */
export interface Abbonamento {
    numeroAbb: number;
    dataInizio: string;
    dataScadenza: string;
    tipoAbb: string;
    ingressiEffettuati: number;
    statoAbb: string;
    atleta?: { cf: string };
    pagamento?: { idPagamento: number };
}
