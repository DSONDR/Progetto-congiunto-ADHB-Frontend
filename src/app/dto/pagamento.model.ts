export interface Pagamento {
  idPagamento?: number;
  importo: number;
  dataPag: string;
  metodoPag?: string;
  statoPag: string;
}
