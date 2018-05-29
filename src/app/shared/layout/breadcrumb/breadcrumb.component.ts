import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'breadcrumb',
  templateUrl: './breadcrumb.component.html'
})
export class BreadcrumbComponent implements OnInit {
  @Input() icon: string;
  @Input() title: string;
  @Input() items: Array<string>;

  constructor() {}

  ngOnInit() {}
}
