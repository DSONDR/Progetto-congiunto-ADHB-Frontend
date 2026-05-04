import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IstruttoriComponent } from './istruttori.component';

describe('IstruttoriComponent', () => {
  let component: IstruttoriComponent;
  let fixture: ComponentFixture<IstruttoriComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IstruttoriComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IstruttoriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
