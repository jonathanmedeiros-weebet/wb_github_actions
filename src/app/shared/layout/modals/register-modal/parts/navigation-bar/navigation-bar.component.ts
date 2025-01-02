import { Component } from '@angular/core';

@Component({
    selector: 'app-navigation-bar',
    templateUrl: './navigation-bar.component.html',
    styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent {
    currentIndex = 0;
    totalSteps = 3;

    previous() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
        }
    }

    next() {
        if (this.currentIndex < this.totalSteps - 1) {
            this.currentIndex++;
        }
    }
}
