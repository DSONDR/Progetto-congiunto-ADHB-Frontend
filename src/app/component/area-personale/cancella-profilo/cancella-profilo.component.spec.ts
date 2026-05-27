import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancellaProfiloComponent } from './cancella-profilo.component';

describe('CancellaProfiloComponent', () => {
  let component: CancellaProfiloComponent;
  let fixture: ComponentFixture<CancellaProfiloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancellaProfiloComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancellaProfiloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
