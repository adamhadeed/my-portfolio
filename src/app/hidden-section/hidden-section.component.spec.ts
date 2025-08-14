import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiddenSectionComponent } from './hidden-section.component';

describe('HiddenSectionComponent', () => {
  let component: HiddenSectionComponent;
  let fixture: ComponentFixture<HiddenSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HiddenSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HiddenSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
