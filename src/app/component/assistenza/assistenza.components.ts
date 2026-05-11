import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssistenzaService } from '../../service/assistenza.service';

import { Assistenza } from '../../dto/assistenza.model';
import { Utente } from '../../dto/utente.model';

@Component({
  selector: 'app-assistenza',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assistenza.component.html',
  styleUrl: './assistenza.component.css'
})

export class AssistenzaComponent implements OnInit {

  ticketList: Assistenza[] = [];
  utenteTicket?: Utente;

  // Inietto il service per poter utilizzare i metodi
  constructor(private assistenzaService: AssistenzaService) { }

  ngOnInit(): void {
    this.caricaTuttiITicket();
  }

  caricaTuttiITicket() {

    this.assistenzaService.getAll().subscribe(data => {

      this.ticketList = data;

    });
  }

  // Carica utente associato al ticket
  caricaUtente(id: number) {

    this.assistenzaService.getUtenteByTicket(id).subscribe(data => {

      this.utenteTicket = data;

    });
  }

}