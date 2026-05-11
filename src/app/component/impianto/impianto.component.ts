import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImpiantoService } from '../../service/impianto.service';
import { Attivita } from '../../dto/attivita.model';
import { Impianto } from '../../dto/impianto.model';

@Component({
  selector: 'app-impianto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './impianto.component.html',
  styleUrl: './impianto.component.css'
})

export class ImpiantoComponent implements OnInit {

  impianti: Impianto[] = [];
  attivitaImpianto: Attivita[] = [];

  // Inietto il service per poterlo usare nei metodi sotto
  constructor(private impiantoService: ImpiantoService) { }

  ngOnInit(): void {
    this.caricaTuttiGliImpianti();
  }

  caricaTuttiGliImpianti() {

    this.impiantoService.getAll().subscribe(data => {

      this.impianti = data;

    });
  }

  // Carica tutte le attività dell'impianto selezionato
  caricaAttivita(id: number) {

    this.impiantoService.getAttivitaByImpianto(id).subscribe(data => {

      this.attivitaImpianto = data;

    });
  }

}