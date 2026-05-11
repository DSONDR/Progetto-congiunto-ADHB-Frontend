import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Abbonamento } from '../../models/abbonamento.model';
import { AbbonamentoService } from '../../services/abbonamento.service';

@Component({
  selector: 'app-abbonamenti',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './abbonamenti.component.html',
  styles: []
})
export class AbbonamentiComponent implements OnInit {
  abbonamenti: Abbonamento[] = [];

  constructor(private abbonamentoService: AbbonamentoService) {}

  ngOnInit(): void {
    this.loadAbbonamenti();
  }

  loadAbbonamenti(): void {
    this.abbonamentoService.getAll().subscribe(data => {
      this.abbonamenti = data;
    });
  }
}
