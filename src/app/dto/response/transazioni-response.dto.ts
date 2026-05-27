export interface PagamentoResponseDTO {
    idPagamento: number;
    metodoPag: string;
    dataPag: string;
    statoPag: string;
    importo: number;
    fattura: string;
    causale: string;
}

export interface QrCodeValidationResponseDTO {
    tipo: string;
    qrCode: string;
    atletaCf: string;
    codiceAttivita: number;
    idPagamento: number;
    numeroAbbonamento: number;
    dataRiferimento: string;
}
