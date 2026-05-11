import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Iscrizione } from '../../models/iscrizione.model';
import { IscrizioneService } from '../../services/iscrizione.service';

@Component({
  selector: 'app-iscrizioni',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './iscrizioni.component.html',
  styles: []
})
export class IscrizioniComponent implements OnInit {
  iscrizioni: Iscrizione[] = [];

  constructor(private iscrizioneService: IscrizioneService) {}

  ngOnInit(): void {
    this.loadIscrizioni();
  }

  loadIscrizioni(): void {
    this.iscrizioneService.getAll().subscribe(data => {
      this.iscrizioni = data;
    });
  }
}
