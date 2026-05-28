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

  /**
   * Inizializza il componente avviando subito il caricamento della lista degli impianti.
   */
  ngOnInit(): void {
    this.caricaImpianti();
  }

  /**
   * Effettua una chiamata al servizio per recuperare l'elenco completo degli impianti sportivi 
   * dal database e aggiorna l'array locale.
   */
  caricaImpianti(): void {
    this.impiantoService.getAll().subscribe(data => {
      this.impianti = data;
    });
  }

  /**
   * Resetta l'oggetto del nuovo impianto svuotando i campi del form
   * e apre la modale di creazione.
   */
  creaImpianto(): void { 
    this.nuovoImpianto = {
      nome: '',
      tipoImpianto: '',
      stato: 'Operativo',
      omologazione: ''
    };
    this.isCreateModalOpen = true; 
  }

  /**
   * Chiude la modale di creazione nascondendola all'utente.
   */
  chiudiModale(): void {
    this.isCreateModalOpen = false;
  }

  /**
   * Salva il nuovo impianto nel sistema.
   * Controlla che i campi obbligatori siano compilati, fa la chiamata di creazione 
   * al servizio e, in caso di successo, ricarica la lista.
   */
  salvaNuovoImpianto(): void {
    /**

     * Verifica che i parametri richiesti siano presenti e validi prima di procedere

     */

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

  /**
   * Modifica lo stato dell'impianto (alternando tra 'Operativo' e 'Manutenzione') 
   * e aggiorna il record nel database tramite il servizio.
   */
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
  
  /**
   * Chiede conferma all'utente e, se accettata, esegue l'eliminazione definitiva dell'impianto,
   * aggiornando successivamente la lista degli impianti visibili.
   */
  cancellaImpianto(id: number): void { 
    /**
 
     * Verifica che i parametri richiesti siano presenti e validi prima di procedere
 
     */
 
    if(confirm(`Sei sicuro di voler eliminare l'impianto ID ${id}?`)) {
      this.impiantoService.delete(id).subscribe({
        next: () => {
          alert(`Impianto ${id} eliminato dal sistema.`); 
          this.caricaImpianti();
        },
        error: (err) => alert("Impossibile cancellare l'impianto. (Forse ci sono attività o sponsor collegati).")
      });
    }
  }
}
