import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Attivita } from '../../models/attivita.model';
import { AttivitaService } from '../../services/attivita.service';

@Component({
  selector: 'app-attivita',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attivita.component.html',
  styles: []
})
export class AttivitaComponent implements OnInit {
  attivitaList: Attivita[] = [];

  constructor(private attivitaService: AttivitaService) {}

  ngOnInit(): void {
    this.loadAttivita();
  }

  loadAttivita(): void {
    this.attivitaService.getAll().subscribe(data => {
      this.attivitaList = data;
    });
  }
}
