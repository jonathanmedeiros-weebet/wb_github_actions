import { Component, Input, OnInit } from "@angular/core";
import { BaseFormComponent } from "../../base-form/base-form.component";
import { config } from "src/app/shared/config";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService, ClienteService, MessageService } from "src/app/services";
import { FormBuilder, Validators } from "@angular/forms";

@Component({
    selector: "app-validate-phone-modal",
    templateUrl: "./validate-phone-modal.component.html",
    styleUrls: ["./validate-phone-modal.component.css"],
})
export class ValidatePhoneModalComponent
    extends BaseFormComponent
    implements OnInit
{
    @Input() senha: string;
    public logo: string = config.LOGO;
    public submitting = false;

    constructor(
        private activeModal: NgbActiveModal,
        private customerService: ClienteService,
        private authService: AuthService,
        private fb: FormBuilder,
        private messageService: MessageService
    ) {
        super();
    }

    get isMobile(): boolean {
        return window.innerWidth <= 1025;
    }

    ngOnInit() {
        this.createForm();
        this.initiatePhoneValidation();
    }

    createForm() {
        this.form = this.fb.group({
            validation_code: [
                null,
                [
                    Validators.required,
                    Validators.minLength(5),
                    Validators.maxLength(5),
                ],
            ],
        });
    }

    initiatePhoneValidation() {
        this.submitting = true;

        this.customerService.initiatePhoneValidation().subscribe({
            next: (res: any) => {
                this.messageService.success(res.message);
                this.submitting = false;
            },
            error: (err: any) => this.handleError(err),
        });
    }

    submit() {
        this.submitting = true;

        const validationCode = this.form.value.validation_code;

        this.customerService.validatePhone(validationCode).subscribe({
            next: (res: any) => {
                this.messageService.success(res.message);
                this.authService.updatePhoneValidationStatus(true);

                this.activeModal.close({
                    checked: true,
                });

                this.submitting = false;
            },
            error: (err: any) => this.handleError(err),
        });
    }

    cancelar() {
        this.activeModal.dismiss("cancelado");
    }

    handleError(error: string) {
        this.messageService.error(error);
        this.submitting = false;
    }
}
