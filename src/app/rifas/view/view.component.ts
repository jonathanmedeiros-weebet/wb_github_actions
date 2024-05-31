import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {RifaSorteioService} from '../../shared/services/rifa/rifa-sorteio.service';
import {RifaBilheteService} from '../../shared/services/rifa/rifa-bilhete.service';
import {config} from '../../shared/config';


@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

    public sorteio: any = null;
    public loading = true;
    public SLUG = config.SLUG;

    constructor(
        private route: ActivatedRoute,
        private rifaservice: RifaSorteioService,
        private rifaBilheteService: RifaBilheteService
    ) {
    }

    ngOnInit() {
        const self = this;
        this.rifaservice.getSorteio(this.route.snapshot.params['id']).subscribe(res => {
            console.log(res);
            this.rifaBilheteService.selecionarSorteio(res);
            self.sorteio = res;
            self.loading = false;
        });



    }


}
