import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RisolviAssistenzeComponent } from './risolvi-assistenze.component';

describe('RisolviAssistenzeComponent', () => {
  let component: RisolviAssistenzeComponent;
  let fixture: ComponentFixture<RisolviAssistenzeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RisolviAssistenzeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RisolviAssistenzeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
