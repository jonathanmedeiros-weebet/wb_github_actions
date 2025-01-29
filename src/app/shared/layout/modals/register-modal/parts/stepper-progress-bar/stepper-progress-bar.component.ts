import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stepper-progress-bar',
  templateUrl: './stepper-progress-bar.component.html',
  styleUrls: ['./stepper-progress-bar.component.scss']
})
export class StepperProgressBarComponent {
  @Input() currentIndex: number;
}
