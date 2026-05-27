import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestioneImpiantiComponent } from './gestione-impianti.component';

describe('GestioneImpiantiComponent', () => {
  let component: GestioneImpiantiComponent;
  let fixture: ComponentFixture<GestioneImpiantiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestioneImpiantiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestioneImpiantiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
