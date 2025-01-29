import { Component, OnInit } from '@angular/core';
import { StepService } from 'src/app/shared/services/step.service';

@Component({
  selector: 'app-login-data',
  templateUrl: './login-data.component.html',
  styleUrls: ['./login-data.component.scss']
})
export class LoginDataComponent implements OnInit {

  currentIndex = 0;
  totalSteps = 3;
  formInvalid = true;
  data = {};

  constructor(private stepService: StepService) {
    this.stepService.currentIndex$.subscribe((index) => {
      this.currentIndex = index;
    });
    this.stepService.formValid$.subscribe((valid) => {
      this.formInvalid = !valid;
    })
  }
  ngOnInit(): void {
    this.stepService.changeFormValid(true);
  }


}
