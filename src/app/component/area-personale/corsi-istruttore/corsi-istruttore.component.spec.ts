import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorsiIstruttoreComponent } from './corsi-istruttore.component';

describe('CorsiIstruttoreComponent', () => {
  let component: CorsiIstruttoreComponent;
  let fixture: ComponentFixture<CorsiIstruttoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CorsiIstruttoreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CorsiIstruttoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
