import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestioneSquadreComponent } from './gestione-squadre.component';

describe('GestioneSquadreComponent', () => {
  let component: GestioneSquadreComponent;
  let fixture: ComponentFixture<GestioneSquadreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestioneSquadreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestioneSquadreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
