export interface IscrizioneRequest {
    atletaCf?: string;
    attivitaId?: number;
    importo?: number;
    metodo?: string;
}

export interface SottoscrizioneRequest {
    atletaCf?: string;
    tipoAbbonamento?: string;
    metodo?: string;
}

export interface UsaAbbonamentoRequest {
    atletaCf?: string;
    attivitaId?: number;
    abbonamentoId?: number;
}

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
