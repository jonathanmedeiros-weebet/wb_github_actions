import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ParametrosLocaisService} from 'src/app/services';
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
    export class PersonalDataComponent extends BaseFormComponent implements OnInit, OnDestroy{
    @Output() dataPersonal = new EventEmitter<any>;
    @Input() data:any;

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
    

    constructor(
        private fb: UntypedFormBuilder,
        private cd: ChangeDetectorRef,
        private ga4Service: Ga4Service,
        private paramsService: ParametrosLocaisService,
        private CountriesService: CountriesService,
        private stepService: StepService
    ) {
        super();
    }

    ngOnInit() {
        this.createForm();
        this.initializeDays();
        this.initializeYears();

        this.form.valueChanges.subscribe(form => {
            if ((form.cpf != null && form.cpf.length == 14)) {
                this.showLoading = false;
                this.cd.detectChanges();
            } else {
                this.showLoading = true;
            }
        })
        this.form.valueChanges.subscribe(() => {
            if(this.form.valid){
                this.stepService.changeFormValid(true);
                this.dataPersonal.emit(this.form.value);
            } else {
                this.stepService.changeFormValid(false);
            }
            
          })   
          ;

        this.autoPreenchimento = this.paramsService.getOpcoes().validar_cpf_receita_federal;
        if (this.data.cpf) {
            this.form.patchValue(this.data);
        }
    }

    onSubmit() {

    }

    createForm() {
        this.form = this.fb.group({
            cpf: [null, [Validators.required, FormValidations.cpfValidator]],
            nome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern(/[a-zA-Z]/)]],
            nomeCompleto: [null],
            day:['dia'],
            month:['mes'],
            year:['ano'],
            nationality:['Brasil'],
            gender:[null]
        })
    };

    initializeDays() {
        this.days = Array.from({length: 31}, (_, i ) => i + 1 )
    }

    initializeYears() {
        const currentYear =  new Date().getFullYear();
        this.years = Array.from({length: 101 }, (_, i) => currentYear - i);
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

    onNationalityChange(){
    }
}
