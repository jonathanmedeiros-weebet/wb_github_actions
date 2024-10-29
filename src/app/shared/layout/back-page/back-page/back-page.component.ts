import { Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationHistoryService } from '../../../services/navigation-history.service';

@Component({
  selector: 'app-back-page',
  templateUrl: './back-page.component.html',
  styleUrls: ['./back-page.component.css']
})
export class BackPageComponent {
  @Input() showBtn: boolean = true;
  @Input() showText: boolean = true;

  constructor(
    private location:Location,
    private navigationHistoryService: NavigationHistoryService,
    private router: Router
  ) {}

  back() {
    const previousUrl = this.navigationHistoryService.getPreviousUrl();

    if (previousUrl && previousUrl.startsWith('/')) {
      this.location.back();
    } else {
      this.router.navigate(['casino']);
    }
  }
}
