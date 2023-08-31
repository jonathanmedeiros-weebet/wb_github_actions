import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { SafeUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-loteria-popular',
    templateUrl: './loteria-popular.component.html',
    styleUrls: ['./loteria-popular.component.css']
})
export class LoteriaPopularComponent {
    gameUrl: SafeUrl = "";

    mobileScreen;
    showLoadingIndicator = true;


}
