import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ClienteService, MessageService, ParametrosLocaisService } from 'src/app/services';
import { BaseFormComponent } from 'src/app/shared/layout/base-form/base-form.component';
import { EventGa4Types, Ga4Service } from 'src/app/shared/services/ga4/ga4.service';
import { StepService } from 'src/app/shared/services/step.service';
import { CountriesService } from 'src/app/shared/services/utils/countries.service';
import { FormValidations } from 'src/app/shared/utils';

@Component({
    selector: 'app-personal-data',
    templateUrl: './personal-data.component.html',
    styleUrls: ['./personal-data.component.scss']
})
export class PersonalDataComponent extends BaseFormComponent implements OnInit, OnDestroy {
    @Output() personalData = new EventEmitter<any>;
    @Input() data: any;

    form: FormGroup;
    dataUserCPF = '';
    cpfValidado = false;
    showLoading = true;
    formSocial = false;
    faceMatchRequested = false;
    validarBeneficioProgramaSocial = '';
    autoPreenchimento = true;
    errorMessage = '';
    dateOfBirth;

    days: number[] = [];
    years: number[] = [];
    selectedNationality: string = '';

    months = [
        { value: 1, name: 'Janeiro' },
        { value: 2, name: 'Fevereiro' },
        { value: 3, name: 'Março' },
        { value: 4, name: 'Abril' },
        { value: 5, name: 'Maio' },
        { value: 6, name: 'Junho' },
        { value: 7, name: 'Julho' },
        { value: 8, name: 'Agosto' },
        { value: 9, name: 'Setembro' },
        { value: 10, name: 'Outubro' },
        { value: 11, name: 'Novembro' },
        { value: 12, name: 'Dezembro' },
    ];

    nationalities = this.CountriesService.getCountries();

    dropdownList = [];
    selectedItems = [];

    constructor(
        private fb: FormBuilder,
        private cd: ChangeDetectorRef,
        private ga4Service: Ga4Service,
        private paramsService: ParametrosLocaisService,
        private CountriesService: CountriesService,
        private stepService: StepService,
        private clientesService: ClienteService,
        private messageService: MessageService,
        private translate: TranslateService
    ) {
        super();
    }

    ngOnInit() {
        this.autoPreenchimento = this.paramsService.getOpcoes().validar_cpf_receita_federal;
        if (this.data.cpf && this.data.nome) {
            this.cpfValidado = true;
        }

        this.selectedItems = [
            { value: 1, name: 'Afeganistão' },
            { value: 2, name: 'África do Sul' },
            { value: 3, name: '"Albânia"' },
        ];

        this.createForm();
        if (!this.autoPreenchimento) {
            this.initializeDays();
            this.initializeYears();
        }

        this.form.valueChanges.subscribe(form => {
            if ((form.cpf != null && form.cpf.length == 14)) {
                this.showLoading = false;
                this.cd.detectChanges();
            } else {
                this.showLoading = true;
            }
        })

        this.form.valueChanges.subscribe(() => {
            if (this.form.valid) {
                this.stepService.changeFormValid(true);
                this.personalData.emit(this.form.value);
            } else {
                this.stepService.changeFormValid(false);
            }
        });

        if (this.data.cpf) {
            this.form.patchValue(this.data);
        };
    }

    onSubmit() {

    }

    createForm() {
        this.form = this.fb.group({
            cpf: [null, [Validators.required, FormValidations.cpfValidator]],
            nome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern(/[a-zA-Z]/)]],
            nomeCompleto: [null],
            dadosCriptografados: [null],
            day: [null, !this.autoPreenchimento ? Validators.required : null],
            month: [null, !this.autoPreenchimento ? Validators.required : null],
            year: [null, !this.autoPreenchimento ? Validators.required : null],
            nationality: [26, [Validators.required]],
            gender: [null, [Validators.required]],
            nascimento: [null, !this.autoPreenchimento ? Validators.required : null]
        })
    };

    initializeDays() {
        this.days = Array.from({ length: 31 }, (_, i) => i + 1)
    }

    initializeYears() {
        const currentYear = new Date().getFullYear();
        this.years = Array.from({ length: 101 }, (_, i) => currentYear - i);
    }

    validarCpf() {
        const { cpf } = this.form.value;
        if (this.validarBeneficioProgramaSocial || this.autoPreenchimento) {
            if (this.form.get('cpf').valid) {
                this.clientesService.validarCpf(cpf).subscribe(
                    res => {
                        if (res.validarCpfAtivado) {
                            const threeMonthsAgo = new Date();
                            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
                            if (res.menorDeIdade) {
                                this.messageService.error(this.translate.instant('geral.cadastroMenorDeIdade'));
                                return;
                            }
                            if (res.beneficios.DataRecebimentoMaisRecente >= threeMonthsAgo.toISOString()) {
                                this.messageService.error(this.translate.instant('register.registrationBeneficiariesSocialPrograms'));
                                return;
                            }
                            this.autoPreenchimento = true;
                            this.cpfValidado = true;
                            this.form.patchValue({
                                nome: res.nome,
                                nomeCompleto: res.nome,
                                dadosCriptografados: res.dados
                            });
                        } else {
                            if (!this.formSocial) {
                                this.form.patchValue({ nome: '' });
                            }
                            this.autoPreenchimento = false;
                            this.cpfValidado = false;
                        }
                    },
                    error => {
                        this.cpfValidado = false;
                        this.form.patchValue({ nome: '' });
                        if (error?.code === 'cpfInformadoNaoExiste') {
                            this.form.controls['cpf'].addValidators(FormValidations.cpfNotExists(cpf));
                            this.form.controls['cpf'].updateValueAndValidity();
                        } else {
                            this.messageService.error(error);
                        }
                    }
                );
            } else {
                this.cpfValidado = false;
                this.form.patchValue({
                    nome: '',
                    dadosCriptografados: null
                });
            }
        }
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
        if (this.form.value.day && this.form.value.month && this.form.value.year) {
            const firstDate = `${this.form.value.year}/${this.form.value.month}/${this.form.value.day}`;
            const data = new Date(firstDate);
            let dataFormatada = `${data.getFullYear()}-${(data.getMonth() + 1).toString().padStart(2, '0')}-${data.getDate().toString().padStart(2, '0')}`;
            this.form.get('nascimento').patchValue(dataFormatada)
        }
    }
}
