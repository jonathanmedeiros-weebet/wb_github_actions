import {Component, Input, OnInit, OnDestroy} from '@angular/core';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.css']
})
export class CountdownComponent implements OnInit, OnDestroy {

    @Input() time = 0;

    now: number;

    days = 0;
    hours = 0;
    minutes = 0;
    seconds = 0;

    intervalId: number;

    constructor() {

    }

    ngOnInit(): void {

        this.intervalId = setInterval(() => {
            this.countdown();
            console.log('countdown', this.time, this.now);
        }, 1000);
    }

    ngOnDestroy(): void {
        clearInterval(this.intervalId);
    }

    countdown() {
        this.now = new Date().getTime();

        const distance = this.time - this.now;

        if ( distance < 0 ) {
            this.days = 0;
            this.hours = 0;
            this.minutes = 0;
            this.seconds = 0;
        } else {
            this.days = Math.floor(distance / (1000 * 60 * 60 * 24));
            this.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            this.seconds = Math.floor((distance % (1000 * 60)) / 1000);
        }


    }

    pad(num: number, size: number): string {
        let s = num + '';
        while (s.length < size) { s = '0' + s; }
        return s;
    }

}
