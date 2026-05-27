// Richiesta per iscrivere un atleta a un'attività
export interface IscrizioneRequest {
    atletaCf?: string;
    attivitaId?: number;
    importo?: number;
    metodo?: string;
}

// Richiesta per sottoscrivere un abbonamento
export interface SottoscrizioneRequest {
    atletaCf?: string;
    tipoAbbonamento?: string;
    metodo?: string;
}

// Richiesta utilizzo abbonamento
export interface UsaAbbonamentoRequest {
    atletaCf?: string;
    attivitaId?: number;
    abbonamentoId?: number;
}

// DTO pagamento
export interface PagamentoRequestDTO {
    idPagamento?: number;
    importo?: number;
    metodoPagamento?: string;
    statoPagamento?: string;
    fattura?: string;
    dataPagamento?: string;
    utenteCf?: string;
    attivitaId?: number;
    abbonamentoId?: number;
}
