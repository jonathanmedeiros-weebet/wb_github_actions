import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../../services';

@Component({
  selector: 'app-navigation',
  templateUrl: 'navigation.component.html'
})
export class NavigationComponent implements OnInit {
  constructor(private auth: AuthService) {}

  ngOnInit() {
  }
}
