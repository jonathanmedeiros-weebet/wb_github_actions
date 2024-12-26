import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperProgressBarComponent } from './stepper-progress-bar.component';

describe('StepperProgressBarComponent', () => {
  let component: StepperProgressBarComponent;
  let fixture: ComponentFixture<StepperProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepperProgressBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepperProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
