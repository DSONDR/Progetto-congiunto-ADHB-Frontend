/**
 * DTO per la creazione o la modifica di una squadra.
 * Scambiato tra SquadraService e SquadraController.
 */
export interface SquadraRequestDTO {
    nome?: string;
    sport?: string;
    campionato?: string;
    allenatoreCf?: string;
}
