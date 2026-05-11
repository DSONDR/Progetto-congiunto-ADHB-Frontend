import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pagamento } from '../../models/pagamento.model';
import { PagamentoService } from '../../services/pagamento.service';

@Component({
  selector: 'app-pagamenti',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagamenti.component.html',
  styles: []
})
export class PagamentiComponent implements OnInit {
  pagamenti: Pagamento[] = [];

  constructor(private pagamentoService: PagamentoService) {}

  ngOnInit(): void {
    this.loadPagamenti();
  }

  loadPagamenti(): void {
    this.pagamentoService.getAll().subscribe(data => {
      this.pagamenti = data;
    });
  }
}
