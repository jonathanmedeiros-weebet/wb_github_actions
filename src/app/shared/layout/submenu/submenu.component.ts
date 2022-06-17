import { Component, Input, OnInit } from "@angular/core";

@Component({
    selector: "app-submenu",
    templateUrl: "./submenu.component.html",
    styleUrls: ["./submenu.component.css"],
})
export class SubmenuComponent implements OnInit {
    @Input() active = true;
    @Input() category = "esporte";

    submenuItems = [];
    submenu = [
        {
            name: "Ao-Vivo",
            link: "/esportes/live",
            icon_class: "wbicon icon-ao-vivo",
            category: "esporte",
        },
        {
            name: "Futebol",
            link: "/esportes/futebol",
            icon_class: "wbicon icon-futebol",
            category: "esporte",
        },
        {
            name: "Futsal",
            link: "/esportes/futsal",
            icon_class: "wbicon icon-futsal",
            category: "esporte",
        },
        {
            name: "Combate",
            link: "/esportes/combate",
            icon_class: "wbicon icon-luta",
            category: "esporte",
        },
        {
            name: "Hóquei no Gelo",
            link: "/esportes/hoquei-gelo",
            icon_class: "wbicon icon-hoquei-no-gelo",
            category: "esporte",
        },
        {
            name: "Futebol Americano",
            link: "/esportes/futebol-americano",
            icon_class: "wbicon icon-futebol-americano",
            category: "esporte",
        },
        {
            name: "E-Sports",
            link: "/esportes/esports",
            icon_class: "wbicon icon-e-sports",
            category: "esporte",
        },
        {
            name: "Tênis",
            link: "/esportes/tenis",
            icon_class: "wbicon icon-tenis",
            category: "esporte",
        },
        {
            name: "Vôlei",
            link: "/esportes/volei",
            icon_class: "wbicon icon-volei",
            category: "esporte",
        },
        {
            name: "Basquete",
            link: "/esportes/basquete",
            icon_class: "wbicon icon-basquete",
            category: "esporte",
        },
        {
            name: "Seninha",
            link: "/loterias/seninha",
            icon_class: "wbicon icon-basquete",
            category: "loteria",
        },
        {
            name: "Quininha",
            link: "/loterias/quininha",
            icon_class: "wbicon icon-basquete",
            category: "loteria",
        }
    ];

    constructor() {}

    ngOnInit() {
        this.submenuItems = this.submenu.filter((item) => {
            return item.category === this.category;
        });
    }
}
