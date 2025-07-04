import { ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { LayoutService, MessageService, ParametrosLocaisService, SidebarService } from 'src/app/services';
import { AccordionItem } from 'src/app/shared/interfaces/accordion-item';
import { AddressComponent } from './address/address.component';
import { DocumentComponent } from './document/document.component';
import { EmailComponent } from './email/email.component';
import { PhoneComponent } from './phone/phone.component';
import { TermsComponent } from './terms/terms.component';
import { AccountVerificationService } from 'src/app/shared/services/account-verification.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { AccountVerificationTypes } from 'src/app/shared/enums';

@Component({
  selector: 'app-registration-validation',
  templateUrl: './personal-data.component.html',
  styleUrls: ['./personal-data.component.css']
})

export class PersonalDataComponent implements OnInit {
    public accordionItems: AccordionItem[] = [
        {
            key: "document",
            title: "personalData.document.title",
            description: "personalData.document.description",
            component: DocumentComponent,
            showVerificationStatus: false,
            isVerified: false,
            isVisible: false
        },
        {
            key: "address",
            title: "personalData.address.title",
            description: "personalData.address.description",
            component: AddressComponent,
            showVerificationStatus: false,
            isVerified: false,
            isVisible: false
        },
        {
            key: "email",
            title: "personalData.email.title",
            description: "personalData.email.description",
            component: EmailComponent,
            showVerificationStatus: false,
            isVerified: false,
            isVisible: false
        },
        {
            key: "phone",
            title: "personalData.phone.title",
            description: "personalData.phone.description",
            component: PhoneComponent,
            showVerificationStatus: false,
            isVerified: false,
            isVisible: false
        },
        {
            key: "terms",
            title: "personalData.terms.title",
            description: "personalData.terms.description",
            component: TermsComponent,
            showVerificationStatus: false,
            isVerified: false,
            isVisible: false
        }
    ];
    headerHeight: number = 92;
    currentHeight: number = window.innerHeight - this.headerHeight;
    unsub$ = new Subject();

    constructor(
        private accountVerificationService: AccountVerificationService,
        private cd: ChangeDetectorRef,
        private layoutService: LayoutService,
        private sidebarService: SidebarService,
        private route: ActivatedRoute,
        private paramsLocais : ParametrosLocaisService
    ) {}

    ngOnInit(): void {
        this.sidebarService.changeItens({contexto: 'cliente'});
        this.verifyAccountVerificationSteps();

        this.layoutService.currentHeaderHeight
            .pipe(takeUntil(this.unsub$))
            .subscribe((curHeaderHeight: number) => {
                this.headerHeight = curHeaderHeight;
                this.currentHeight = window.innerHeight - this.headerHeight;
                this.cd.detectChanges();
            });
    }

    private isOpenAccordion(accordionName: string) {
        const accordions = {
            [AccountVerificationTypes.DOCUMENT]: 'openDocumentAccordion',
            [AccountVerificationTypes.EMAIL]: 'openEmailAccordion',
            [AccountVerificationTypes.PHONE]: 'openPhoneAccordion',
            [AccountVerificationTypes.ADDRESS]: 'openAddressAccordion',
        }

        const paramKey = accordions[accordionName] ?? '';
        return Boolean(this.route.snapshot.queryParamMap.get(paramKey));
    }

    private verifyAccountVerificationSteps() {
        this.accountVerificationService.verifiedSteps.subscribe(
            async () => {

                const { addressVerified, verifiedSteps } = await this.accountVerificationService.getForceAccountVerificationDetail();
                if (this.paramsLocais.getOpcoes().address_required) {
                    verifiedSteps['address'] = addressVerified;
                }

                this.accordionItems = this.accordionItems.map((item: AccordionItem) => ({
                    ...item,
                    showVerificationStatus: verifiedSteps[item.key] != undefined,
                    isVerified: Boolean(verifiedSteps[item.key]),
                    isVisible: this.isOpenAccordion(item.key)
                }))
            }
        )
    }

    toggleVisibilityItem(item: AccordionItem) {
        this.accordionItems.forEach((i) => {
            if (i != item) {
                i.isVisible = false;
            }
        })

        item.isVisible = !item.isVisible;
    }
}
