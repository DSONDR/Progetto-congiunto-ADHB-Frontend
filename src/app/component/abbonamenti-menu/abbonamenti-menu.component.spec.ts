import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbbonamentiMenuComponent } from './abbonamenti-menu.component';

describe('AbbonamentiMenuComponent', () => {
  let component: AbbonamentiMenuComponent;
  let fixture: ComponentFixture<AbbonamentiMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbbonamentiMenuComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AbbonamentiMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
