/**
 * DTO utilizzato per inviare i dati di apertura di un nuovo ticket di assistenza.
 * Scambiato tra il frontend (AssistenzaService) e il backend (AssistenzaController).
 */
export interface AssistenzaRequestDTO {
    oggetto?: string;
    tipoAss?: string;
    utenteCf?: string;
    contenuto?: string;
}
