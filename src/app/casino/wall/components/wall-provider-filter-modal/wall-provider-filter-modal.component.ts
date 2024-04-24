import { Component, Input } from '@angular/core';
import { Fornecedor } from '../../wall.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-wall-provider-filter-modal',
  templateUrl: './wall-provider-filter-modal.component.html',
  styleUrls: ['./wall-provider-filter-modal.component.scss']
})
export class WallProviderFilterModalComponent {
  @Input() providers: Fornecedor[] = []
  @Input() providerSelected: string = "";
  public providerTerm: string = "";

  constructor(private activeModal: NgbActiveModal){}

  get providerList(): Fornecedor[] {
    if(!Boolean(this.providerTerm)) return this.providers;
    return this.providers.filter(
      (provider: Fornecedor) => 
        provider.gameFornecedorExibicao.toLocaleLowerCase().includes(this.providerTerm.toLocaleLowerCase())
    )
  }

  public handleProviderSelect(provider: string) {
    this.providerSelected = provider;
  }

  public handleApplyFilter() {
    this.activeModal.close({
      event: 'apply',
      data: {
        providerSelected: this.providerSelected
      }
    })
  }

  public handleClearFilter() {
    this.providerSelected = ""
  }

  public handleClose() {
    this.activeModal.close({
      event: 'close',
      data: {}
    })
  }

  public handleSearch(term) {
    this.providerTerm = term;
  }

  public handleClearSearch() {
    this.providerTerm = '';
  }
}
