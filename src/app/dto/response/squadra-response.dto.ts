/**
 * DTO di risposta con le info pubbliche di una squadra.
 * Restituito da SquadraController e consumato da SquadraService.
 */
export interface SquadraResponseDTO {
    id: number;
    nome: string;
    sport: string;
    campionato: string;
    allenatoreCf: string;
    nomeAllenatore: string;
}
