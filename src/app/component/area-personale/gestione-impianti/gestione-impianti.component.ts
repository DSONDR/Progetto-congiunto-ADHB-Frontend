import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImpiantoService, Impianto } from '../../../service/impianto.service';

@Component({
  selector: 'app-gestione-impianti',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestione-impianti.component.html',
  styleUrl: './gestione-impianti.component.scss'
})
export class GestioneImpiantiComponent implements OnInit {
  
  impianti: any[] = [];
  
  // Variabili Modale Creazione
  isCreateModalOpen: boolean = false;
  nuovoImpianto: any = {
    nome: '',
    tipoImpianto: '',
    stato: 'Operativo',
    omologazione: ''
  };

  constructor(private impiantoService: ImpiantoService) {}

  ngOnInit(): void {
    this.caricaImpianti();
  }

  caricaImpianti(): void {
    this.impiantoService.getAll().subscribe(data => {
      this.impianti = data;
    });
  }

  creaImpianto(): void { 
    this.nuovoImpianto = {
      nome: '',
      tipoImpianto: '',
      stato: 'Operativo',
      omologazione: ''
    };
    this.isCreateModalOpen = true; 
  }

  chiudiModale(): void {
    this.isCreateModalOpen = false;
  }

  salvaNuovoImpianto(): void {
    if (!this.nuovoImpianto.nome || !this.nuovoImpianto.tipoImpianto) {
      alert('Compila tutti i campi obbligatori!');
      return;
    }
    this.impiantoService.create(this.nuovoImpianto).subscribe({
      next: () => {
        alert('Impianto creato con successo!');
        this.isCreateModalOpen = false;
        this.caricaImpianti();
      },
      error: (err) => alert('Errore durante la creazione: ' + (err.error?.message || ''))
    });
  }

  cambiaStato(impianto: Impianto): void { 
    const nuovoStato = impianto.stato === 'Operativo' ? 'Manutenzione' : 'Operativo';
    
    // Clona e aggiorna solo lo stato
    const updatedImpianto = { ...impianto, stato: nuovoStato };
    
    this.impiantoService.update(impianto.id, updatedImpianto).subscribe({
      next: () => {
        alert(`Stato dell'impianto ${impianto.id} aggiornato a ${nuovoStato}.`); 
        this.caricaImpianti();
      },
      error: (err) => alert('Impossibile aggiornare lo stato. ' + (err.error?.message || ''))
    });
  }
  
  cancellaImpianto(id: number): void { 
    if(confirm(`Sei sicuro di voler eliminare l'impianto ID ${id}?`)) {
      this.impiantoService.delete(id).subscribe({
        next: () => {
          alert(`Impianto ${id} eliminato dal sistema.`); 
          this.caricaImpianti();
        },
        error: (err) => alert('Impossibile cancellare l\'impianto. (Forse ci sono attività o sponsor collegati).')
      });
    }
  }
}