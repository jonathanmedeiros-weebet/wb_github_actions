import { Directive, HostListener } from '@angular/core';
import { IdleDetectService } from '../../services/idle-detect.service';
import { ActivityDetectService } from '../../services/activity-detect.service';

@Directive({
    selector: 'div[idleDetect]'
})
export class IdleDetectDirective {

    constructor(private idleDetectService: IdleDetectService, private activityDetectService: ActivityDetectService) {}

    @HostListener('keydown', ['$event'])
    onKeydown(event: any) {
        void event;
        this.idleDetectService.resetTimer();
    }

    @HostListener('mousemove', ['$event'])
    onMove(event: any) {
        void event;
        this.idleDetectService.resetTimer();
    }

    @HostListener('click', ['$event'])
    onClick(event: any) {
        void event;
        this.idleDetectService.resetTimer();
    }

    @HostListener('contextmenu', ['$event'])
    onContextMenuClick(event: any) {
        void event;
        this.idleDetectService.resetTimer();
    }

    @HostListener('wheel', ['$event'])
    onWheelClick(event: any) {
        void event;
        this.idleDetectService.resetTimer();
    }

    @HostListener('document:visibilitychange', ['$event'])
    onVisibilityChange() {
        if (document.hidden) {
            this.activityDetectService.stopActivityTimer();
        } else {
            this.activityDetectService.resumeActivityTimer();
        }
    }
}
