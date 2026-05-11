import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SponsorService } from '../../service/sponsor.service';

import { Sponsor } from '../../dto/sponsor.model';
import { Squadra } from '../../dto/squadra.model';
import { Impianto } from '../../dto/impianto.model';

@Component({
  selector: 'app-sponsor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sponsor.component.html',
  styleUrl: './sponsor.component.css'
})

export class SponsorComponent implements OnInit {

  sponsorList: Sponsor[] = [];

  squadreSponsor: Squadra[] = [];
  impiantiSponsor: Impianto[] = [];

  // Inietto il service per poter utillizzare i metodi sotto
  constructor(private sponsorService: SponsorService) { }

  ngOnInit(): void {
    this.caricaTuttiGliSponsor();
  }

  caricaTuttiGliSponsor() {

    this.sponsorService.getAll().subscribe(data => {

      this.sponsorList = data;

    });
  }

  // Carica tutte le squadre sponsorizzate
  caricaSquadre(id: number) {

    this.sponsorService.getSquadreBySponsor(id).subscribe(data => {

      this.squadreSponsor = data;

    });
  }

  // Carica tutti gli impianti sponsorizzati
  caricaImpianti(id: number) {

    this.sponsorService.getImpiantiBySponsor(id).subscribe(data => {

      this.impiantiSponsor = data;

    });
  }

}