import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AccountVerificationService, ClienteService, MessageService, UtilsService } from 'src/app/services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Endereco } from 'src/app/shared/models/endereco/endereco';
import { Cidade } from 'src/app/shared/models/endereco/cidade';
import { Estado } from 'src/app/shared/models/endereco/estado';
import { debounceTime, distinctUntilChanged, pairwise, skip} from 'rxjs/operators';

export interface CustomerResponse {
    cpf: string;
    nome: string;
    sobrenome: string;
    dataNascimento: string;
    nationality: string;
    genero: string;
    endereco: any;
}

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent {
    address: any = null;
    formAddress: FormGroup;

    public states: Array<Estado>;
    public cities: Array<Cidade>;

    constructor(
        private clienteService: ClienteService,
        private fb: FormBuilder,
        private messageService: MessageService,
        private utilsService: UtilsService,
        private translate: TranslateService,
        private accountVerificationService: AccountVerificationService
    ) {}

    ngOnInit(): void {
        this.formAddress = this.fb.group({
            street: ['', Validators.required],
            number: ['', Validators.required],
            district: ['', Validators.required],
            complement: [''],
            city: ['', Validators.required],
            state: ['', Validators.required],
            zipcode: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
        });

        this.formAddress.controls['zipcode']
            .valueChanges
            .pipe(
                debounceTime(1000),
                distinctUntilChanged(),
                skip(1)
            )
            .subscribe((currentZipcode) => {
                this.searchForZipcode(currentZipcode)
            });

        this.utilsService.getEstados().subscribe(states => this.states = states);
        this.loadCustomerAddress();
    }

    getCities(event: any) {
        let estadoId = event.target.value;

        if (estadoId > 0) {
            this.utilsService.getCidades(event.target.value).subscribe(
                cidades => this.cities = cidades,
                error => this.messageService.error(error)
            );
        }
    }

    searchForZipcode(zipcode: string) {
        if (zipcode.length == 8) {
            this.utilsService.getEnderecoPorCep(zipcode).subscribe(
                (address: any) => {
                    if (!address.erro) {
                        let currentState: Estado;
                        for (let state of this.states) {
                            if (state.uf == address.uf) {
                                currentState = state;
                            }
                        }

                        if (currentState.id != this.formAddress.get('state').value) {
                            this.formAddress.get('state').patchValue(currentState.id);
                            this.utilsService.getCidades(currentState.id).subscribe(
                                cities => {
                                    this.cities = cities;
                                    for (let city of cities) {
                                        if (city.nome == address.localidade.toUpperCase()) {
                                            this.formAddress.get('city').patchValue(city.id);
                                        }
                                    }
                                },
                                error => this.messageService.error(error));
                        } else {
                            for (let city of this.cities) {
                                if (city.nome == address.localidade.toUpperCase()) {
                                    this.formAddress.get('city').patchValue(city.id);
                                }
                            }
                        }
                        if (address.bairro) {
                            this.formAddress.get('district').patchValue(address.bairro);
                        }
                        if (address.logradouro) {
                            this.formAddress.get('street').patchValue(address.logradouro);
                        }
                    } else {
                        this.messageService.error(this.translate.instant('geral.enderecoNaoEncontrado'));
                    }
                },
            );
        }
    }


    loadCustomerAddress() {
        const user = JSON.parse(localStorage.getItem('user'));
        this.clienteService.getCliente(user.id)
            .subscribe({
                next: (res: any) => {
                    const address: Endereco = res.endereco;
                    const stateCurrent = address.estado.id;
                    const cityCurrent = address.cidade.id;

                    this.utilsService.getCidades(address.estado.id)
                    .subscribe(
                        cidades => this.cities = cidades,
                        error => this.messageService.error(error)
                    );

                    this.formAddress.patchValue({
                        street: address.logradouro,
                        number: address.numero,
                        district: address.bairro,
                        zipcode: address.cep,
                        complement: address.complement,
                    });
                    this.formAddress.get('state').patchValue(stateCurrent);
                    this.formAddress.get('city').patchValue(cityCurrent);
                },
                error: () => {
                    this.messageService.error(this.translate.instant('erroInesperado'));
                }
            });
    }

    onSubmit() {
        if (this.formAddress.valid) {
            let values = this.formAddress.value;
            this.clienteService.updateAddress(values)
            .subscribe({
                next: () => {
                    this.messageService.success(this.translate.instant('geral.alteracoesSucesso'));
                    this.accountVerificationService.getAccountVerificationDetail().toPromise();
                },
                error: (err) => {
                    this.messageService.error(err);
                }
            });
        } else {
            //this.checkFormValidations(this.formAddress);
        }
    }
}
