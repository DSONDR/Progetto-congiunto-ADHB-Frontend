import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestioneSponsorComponent } from './gestione-sponsor.component';

describe('GestioneSponsorComponent', () => {
  let component: GestioneSponsorComponent;
  let fixture: ComponentFixture<GestioneSponsorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestioneSponsorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestioneSponsorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
