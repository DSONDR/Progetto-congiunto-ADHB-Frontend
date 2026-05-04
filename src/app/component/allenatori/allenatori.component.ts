import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Serve per *ngFor e i filtri
import { FormsModule } from '@angular/forms';   // Serve per collegare gli input alle variabili
import { Allenatore } from '../../dto/allenatore.model';
import { AllenatoreService } from '../../service/allenatore.service';

@Component({
  selector: 'app-allenatori',
  standalone: true, // Ormai Angular usa i componenti standalone di default
  imports: [CommonModule, FormsModule], // AGGIUNTI: senza questi non vedresti nulla
  templateUrl: './allenatori.component.html',
  styleUrl: './allenatori.component.scss'
})
export class AllenatoriComponent implements OnInit {
  allenatori: Allenatore[] = []; // La lista che mostriamo
  
  // Variabili per i filtri (inizializzate con valori standard)
  grado: number = 1;
  minGrado: number = 0;
  maxGrado: number = 10;

  constructor(private service: AllenatoreService) {}

  // Questo metodo parte da solo quando la pagina si carica
  ngOnInit(): void {
    this.caricaTutti();
  }

  caricaTutti(): void {
    this.service.getAll().subscribe(data => this.allenatori = data);
  }

  applicaRicerca(): void{
    this.service.getByGrado(this.grado).subscribe({
      next: (data) => this.allenatori = data,
      error: (err) => console.error("Errore!", err)
    });
  }

  applicaFiltro(): void {
    this.service.getByGradoBetween(this.minGrado, this.maxGrado).subscribe({
      next: (data) => this.allenatori = data,
      error: (err) => console.error("Errore!", err)
    });
  }
}