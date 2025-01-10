import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ParametrosLocaisService } from 'src/app/services';
import { BaseFormComponent } from 'src/app/shared/layout/base-form/base-form.component';
import { EventGa4Types, Ga4Service } from 'src/app/shared/services/ga4/ga4.service';
import { FormValidations } from 'src/app/shared/utils';

    @Component({
    selector: 'app-personal-data',
    templateUrl: './personal-data.component.html',
    styleUrls: ['./personal-data.component.scss']
    })
    export class PersonalDataComponent extends BaseFormComponent implements OnInit, OnDestroy{

    form: FormGroup;
    dataUserCPF = '';
    cpfValidado = false;
    showLoading = true;
    formSocial = false;
    faceMatchRequested = false;
    validarBeneficioProgramaSocial = '';
    autoPreenchimento = true;
    errorMessage = '';

    days: number[] = [];

    constructor(
        private fb: UntypedFormBuilder,
        private cd: ChangeDetectorRef,
        private ga4Service: Ga4Service,
        private paramsService: ParametrosLocaisService,
    ) {
        super();
    }

    ngOnInit() {
        this.createForm();
        this.initializeDays();
        this.form.valueChanges.subscribe(form => {
            if ((form.cpf != null && form.cpf.length == 14)) {
                this.showLoading = false;
                this.cd.detectChanges();
            } else {
                this.showLoading = true;
            }
        })

        this.autoPreenchimento = this.paramsService.getOpcoes().validar_cpf_receita_federal;
    }

    onSubmit() {

    }

    createForm() {
        this.form = this.fb.group({
            cpf: [null, [Validators.required, FormValidations.cpfValidator]],
            nome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern(/[a-zA-Z]/)]],
            nomeCompleto: [null],
            day:[new Date().getDate()],
        })
    };

    initializeDays() {
        this.days = Array.from({length: 31}, (_, i ) => i + 1 )
    }

    validarCpf(){

    }

    async submit() {
    }

    handleError(error: string) {
        this.errorMessage = error;
    }

    ngOnDestroy() {

    }

    onBeforeInput(e: InputEvent, inputName) {
        FormValidations.blockInvalidCharacters(e, inputName);
    }

    onBlurGa4Name(event: any): void {
        const value = event.target.value;
        if (value) {
            this.ga4Service.triggerGa4Event(EventGa4Types.START_REGISTRATION);
        }
    }

    onDateChange() {
        console.log('Data selecionada: ${this.selectedDay}')
    }
}
