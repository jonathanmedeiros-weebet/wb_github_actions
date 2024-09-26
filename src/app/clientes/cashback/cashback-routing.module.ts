import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CashbackComponent } from './cashback.component';


const routes: Routes = [
    {
        path: '',
        component: CashbackComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CashbackRoutingModule { }
