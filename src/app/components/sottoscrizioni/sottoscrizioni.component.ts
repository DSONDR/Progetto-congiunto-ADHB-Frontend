import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sottoscrizione } from '../../models/sottoscrizione.model';
import { SottoscrizioneService } from '../../services/sottoscrizione.service';

@Component({
  selector: 'app-sottoscrizioni',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sottoscrizioni.component.html',
  styles: []
})
export class SottoscrizioniComponent implements OnInit {
  sottoscrizioni: Sottoscrizione[] = [];

  constructor(private sottoscrizioneService: SottoscrizioneService) {}

  ngOnInit(): void {
    this.loadSottoscrizioni();
  }

  loadSottoscrizioni(): void {
    this.sottoscrizioneService.getAll().subscribe(data => {
      this.sottoscrizioni = data;
    });
  }
}
