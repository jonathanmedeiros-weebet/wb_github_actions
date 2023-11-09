import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cassino-layout',
  templateUrl: './cassino-layout.component.html',
  styleUrls: ['./cassino-layout.component.css']
})
export class CassinoLayoutComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }
}
