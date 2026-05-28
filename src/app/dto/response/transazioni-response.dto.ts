/**
 * DTO per mappare storici di transazioni e pagamenti per l'area personale.
 * Restituito da PagamentoController e consumato da PagamentoService.
 */
export interface PagamentoResponseDTO {
    idPagamento: number;
    metodoPag: string;
    dataPag: string;
    statoPag: string;
    importo: number;
    fattura: string;
    causale: string;
}
