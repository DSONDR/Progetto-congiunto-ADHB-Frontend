import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistenzaMenuComponent } from './assistenza-menu.component';

describe('AssistenzaMenuComponent', () => {
  let component: AssistenzaMenuComponent;
  let fixture: ComponentFixture<AssistenzaMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssistenzaMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssistenzaMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
