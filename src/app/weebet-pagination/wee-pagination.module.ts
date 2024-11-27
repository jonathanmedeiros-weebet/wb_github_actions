import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeePaginationComponent } from './wee-pagination.component';

@NgModule({
    imports: [CommonModule],
    declarations: [WeePaginationComponent],
    exports: [WeePaginationComponent]
})
export class WeePaginationModule { }
