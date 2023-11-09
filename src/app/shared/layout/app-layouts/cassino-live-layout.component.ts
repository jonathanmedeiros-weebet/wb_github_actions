import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cassino-live-layout',
  templateUrl: './cassino-live-layout.component.html',
  styleUrls: ['./cassino-live-layout.component.css']
})
export class CassinoLiveLayoutComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }
}
