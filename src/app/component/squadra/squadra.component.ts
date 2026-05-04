import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Per usare *ngIf e *ngFor
import { SquadraService } from '../../service/squadra.service';
import { Atleta } from '../../dto/atleta.model';
import { Squadra } from '../../dto/squadra.model';

@Component({
  selector: 'app-squadra',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './squadra.component.ts.html',
  styleUrl: './squadra.component.ts.css'
})
export class SquadraComponent implements OnInit {

  squadre: Squadra[] = [];
  atletiDellaSquadra: Atleta[] = [];
  atletiConVisitaScaduta: Atleta[] = [];

  // Iniettiamo il service per poterlo usare nei metodi sotto
  constructor(private squadraService: SquadraService) { }

  ngOnInit(): void {
    this.caricaTutteLeSquadre();
  }

  caricaTutteLeSquadre() {
    this.squadraService.getAll().subscribe(data => {
      this.squadre = data;
    });
  }

  // Carica tutti gli atleti della squadra selezionata
  caricaAtleti(id: number) {
    this.squadraService.getAtletiBySquadra(id).subscribe(data => {
      this.atletiDellaSquadra = data;
    });
  }

  // Carica solo quelli con la visita scaduta (per avvisarli!)
  mostraAlertSalute(id: number) {
    this.squadraService.getAtletiScaduti(id).subscribe(data => {
      this.atletiConVisitaScaduta = data;
      if (data.length > 0) {
        console.warn("Attenzione: ci sono atleti con certificato scaduto!");
      }
    });
  }
}