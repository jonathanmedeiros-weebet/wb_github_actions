import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AuthService, BannerService, ParametrosLocaisService } from 'src/app/services';
import { ModalControllerService } from 'src/app/shared/services/modal-controller.service';

@Component({
  selector: 'app-account-verification-alert',
  templateUrl: './account-verification-alert.component.html',
  styleUrls: ['./account-verification-alert.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AccountVerificationAlertComponent implements OnInit {
  public title: string;
  public description: string;
  private registerBanner: any;
  public hasRegisterBanner: boolean = false;

  constructor(
    private activeModal: NgbActiveModal,
    private authService: AuthService,
    private paramsLocaisService: ParametrosLocaisService,
    private bannerService: BannerService,
    private translate: TranslateService,
    private modalControllerService: ModalControllerService,
  ) { }

  ngOnInit(): void {
    this.prepareInfo();
    this.prepareBanner();
  }

  private prepareInfo() {
    this.description = `${this.paramsLocaisService.getOpcoes().banca_nome} ${this.translate.instant('accountVerification.alertAccountVerificationDescription')}`;
  }

  public goToAccountVerification() {
    this.activeModal.close(true);
    this.modalControllerService.openAccountVerificationOnboarding();
  };

  public handleLogout() {
    this.authService.logout();
  }

  get registerBannerMobile() {
    return Boolean(this.registerBanner) ? this.registerBanner?.src_mobile : null;
  }

  private prepareBanner() {
    const page = 'cadastro';
    this.bannerService
      .banners
      .subscribe((banners) => {
        if (Boolean(banners) && Boolean(banners.length)) {
          this.registerBanner = banners.find(banner => banner.pagina == page);
          this.hasRegisterBanner = Boolean(this.registerBanner);
        }
      })
  }
}
