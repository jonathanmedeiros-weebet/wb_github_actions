import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PagesLayoutComponent } from "../shared/layout/app-layouts/pages-layout.component";

import { ResultadosEsporteComponent } from "./esportes/resultados-esporte.component";
import { ResultadosLoteriasComponent } from "./loterias/resultados-loterias.component";

export const routes: Routes = [
    {
        path: "",
        component: PagesLayoutComponent,
        children: [
            { path: "esportes", component: ResultadosEsporteComponent },
            { path: "loterias", component: ResultadosLoteriasComponent },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ResultadosRoutingModule {}
