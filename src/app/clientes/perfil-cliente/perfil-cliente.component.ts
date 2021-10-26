import {Component, OnInit} from '@angular/core';
import {BaseFormComponent} from '../../shared/layout/base-form/base-form.component';
import {FormBuilder, Validators} from '@angular/forms';
import {ClienteService} from '../../shared/services/clientes/cliente.service';
import {MessageService} from '../../shared/services/utils/message.service';
import {formatDate} from '@angular/common';
import {Estado} from '../../shared/models/endereco/estado';
import {Cidade} from '../../shared/models/endereco/cidade';
import {EnderecoWeebet} from '../../shared/models/endereco/enderecoWeebet';
import {UtilsService} from '../../shared/services/utils/utils.service';
import {result} from 'lodash';
import {takeUntil} from 'rxjs/operators';

@Component({
    selector: 'app-perfil-cliente',
    templateUrl: './perfil-cliente.component.html',
    styleUrls: ['./perfil-cliente.component.css']
})
export class PerfilClienteComponent extends BaseFormComponent implements OnInit {
    estados: Array<Estado>;
    cidades: Array<Cidade>;
    estadoSelecionado: number;
    cidadeSelecionada: number;

    constructor(
        private fb: FormBuilder,
        private clienteService: ClienteService,
        private utilsService: UtilsService,
        private messageService: MessageService
    ) {
        super();
        this.cidades = [];
        this.estadoSelecionado = 0;
        this.cidadeSelecionada = 0;
    }

    ngOnInit() {
        this.createForm();
        const user = JSON.parse(localStorage.getItem('user'));
        this.utilsService.getEstados()
            .subscribe(
                estados => {
                    this.estados = estados;
                });
        this.clienteService.getCliente(user.id)
            .subscribe(
                cliente => {
                    this.form.patchValue(
                        {
                            nome: cliente?.nome?.toUpperCase(),
                            sobrenome: cliente?.sobrenome?.toUpperCase(),
                            nascimento: formatDate(cliente?.dataNascimento?.date, 'dd/MM/YYYY', 'pt-BR'),
                            sexo: cliente?.genero?.toUpperCase(),
                            cpf: cliente?.cpf,
                            telefone: cliente?.telefone,
                            email: cliente?.email
                        }
                    );
                    if (cliente.endereco) {
                        const endereco: EnderecoWeebet = cliente.endereco;
                        if (endereco) {
                            this.estadoSelecionado = endereco.estado.id;
                            this.cidadeSelecionada = endereco.cidade.id;
                            this.utilsService.getCidades(endereco.estado.id).subscribe(
                                cidades => {
                                    this.cidades = cidades;
                                },
                                error => this.handleError(error));
                            this.form.patchValue(
                                {
                                    logradouro: endereco.logradouro,
                                    numero: endereco.numero,
                                    bairro: endereco.bairro,
                                    cep: endereco.cep
                                }
                            );
                        }
                    }
                },
                error => {
                    this.handleError('Algo inesperado aconteceu. Tente novamente mais tarde.');
                }
            );
    }

    createForm() {
        this.form = this.fb.group({
            nome: [{value: '', disabled: true}],
            sobrenome: [{value: '', disabled: true}],
            nascimento: [{value: '', disabled: true}],
            sexo: [{value: '', disabled: true}],
            cpf: [{value: '', disabled: true}],
            telefone: ['', Validators.required],
            email: ['', Validators.required],
            logradouro: ['', Validators.required],
            numero: ['', Validators.required],
            bairro: ['', Validators.required],
            cidade: ['', Validators.required],
            estado: ['', Validators.required],
            cep: ['', Validators.required],
            senha_atual: [null, Validators.required]
        });
    }

    getCidades(estado_id: any) {
        this.utilsService.getCidades(estado_id).subscribe(
            cidades => {
                this.cidades = cidades;
            },
            error => this.handleError(error));
    }

    buscarPorCep(event: any) {
        const cepValue = event.target.value;
        if (cepValue.length == 9) {
            this.utilsService.pesquisarEnderecoPorCep(cepValue).subscribe(
                (endereco: any) => {
                    if (!endereco.erro) {
                        let estadoLocal: Estado;
                        for (let estado of this.estados) {
                            if (estado.uf == endereco.uf) {
                                estadoLocal = estado;
                            }
                        }
                        this.estadoSelecionado = estadoLocal.id;
                        this.utilsService.getCidades(estadoLocal.id).subscribe(
                            cidades => {
                                this.cidades = cidades;
                                for (let cidade of this.cidades) {
                                    if (cidade.nome == endereco.localidade.toUpperCase()) {
                                        this.cidadeSelecionada = cidade.id;
                                    }
                                }

                            },
                            error => this.handleError(error));
                        this.form.patchValue({
                            logradouro: endereco.logradouro,
                            bairro: endereco.bairro,
                        });
                    } else {
                        this.handleError('Endereço não encontrado, por favor preencha manualmente');
                    }
                },
            );
        }
    }

    submit() {
        const values = this.form.value;
        this.clienteService.atualizarDadosCadastrais(values)
            .subscribe(
                () => {
                    this.messageService.success('Dados Cadastrais atualizados.');
                },
                error => {
                    this.handleError(error);
                }
            );
    }

    handleError(mensagem: string) {
        this.messageService.error(mensagem);
    }

}
