import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsaAbbonamento } from '../../models/usa-abbonamento.model';
import { UsaAbbonamentoService } from '../../services/usa-abbonamento.service';

@Component({
  selector: 'app-usa-abbonamenti',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usa-abbonamenti.component.html',
  styles: []
})
export class UsaAbbonamentiComponent implements OnInit {
  usaAbbonamenti: UsaAbbonamento[] = [];

  constructor(private usaAbbonamentoService: UsaAbbonamentoService) {}

  ngOnInit(): void {
    this.loadUsaAbbonamenti();
  }

  loadUsaAbbonamenti(): void {
    this.usaAbbonamentoService.getAll().subscribe(data => {
      this.usaAbbonamenti = data;
    });
  }
}
