export interface TipoAbbonamentoDTO {
    nome: string;
    tipo: string;
    prezzo: number;
    durataMesi: number;
    maxIngressi: number;
}

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

export interface SottoscrizioneResponseDTO {
    sottoscrizione: Sottoscrizione;
    avviso: string | null;
}

export interface Abbonamento {
    numeroAbb: number;
    dataInizio: string;
    dataScadenza: string;
    tipoAbb: string;
    ingressiEffettuati: number;
    statoAbb: string;
}
