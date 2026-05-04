import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllenatoriComponent } from './allenatori.component';

describe('AllenatoriComponent', () => {
  let component: AllenatoriComponent;
  let fixture: ComponentFixture<AllenatoriComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllenatoriComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllenatoriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
