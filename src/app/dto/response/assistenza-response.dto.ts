/**
 * DTO di risposta contenente i dettagli di un ticket di assistenza (incluso stato e messaggi).
 * Restituito da AssistenzaController e consumato da AssistenzaService.
 */
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
