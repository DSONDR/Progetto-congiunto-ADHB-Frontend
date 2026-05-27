import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllenamentiAllenatoreComponent } from './allenamenti-allenatore.component';

describe('AllenamentiAllenatoreComponent', () => {
  let component: AllenamentiAllenatoreComponent;
  let fixture: ComponentFixture<AllenamentiAllenatoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllenamentiAllenatoreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllenamentiAllenatoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
