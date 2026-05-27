export interface AssistenzaResponseDTO {
    idTicket: number;
    oggetto: string;
    tipoAss: string;
    stato: string;
    soddisfazione: number;
    utenteCf: string;
    assistenteCf: string;
    contenuto: string;
    risposta?: string;
}
