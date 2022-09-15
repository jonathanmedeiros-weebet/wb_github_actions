import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {BaseFormComponent} from '../../shared/layout/base-form/base-form.component';
import {ClienteService} from '../../shared/services/clientes/cliente.service';
import {MessageService} from '../../shared/services/utils/message.service';
import {Estado} from '../../shared/models/endereco/estado';
import {Cidade} from '../../shared/models/endereco/cidade';
import {UtilsService} from '../../shared/services/utils/utils.service';
import {Endereco} from '../../shared/models/endereco/endereco';
import {MenuFooterService} from '../../shared/services/utils/menu-footer.service';
import * as moment from 'moment';
import { SidebarService } from 'src/app/services';

@Component({
    selector: 'app-cliente-perfil',
    templateUrl: './cliente-perfil.component.html',
    styleUrls: ['./cliente-perfil.component.css']
})
export class ClientePerfilComponent extends BaseFormComponent implements OnInit, OnDestroy {
    estados: Array<Estado>;
    cidades: Array<Cidade>;
    estadoSelecionado: number;
    cidadeSelecionada: number;
    showLoading = true;

    constructor(
        private fb: FormBuilder,
        private clienteService: ClienteService,
        private utilsService: UtilsService,
        private messageService: MessageService,
        private menuFooterService: MenuFooterService,
        private sidebarService: SidebarService,
    ) {
        super();
        this.cidades = [];
        this.estadoSelecionado = 0;
        this.cidadeSelecionada = 0;
    }

    ngOnInit() {
        this.sidebarService.changeItens({contexto: 'cliente'});

        this.createForm();
        this.utilsService.getEstados()
            .subscribe(
                estados => {
                    this.estados = estados;
                });

        this.loadCliente();

        this.menuFooterService.setIsPagina(true);
    }

    loadCliente() {
        const user = JSON.parse(localStorage.getItem('user'));
        this.clienteService
            .getCliente(user.id)
            .subscribe(
                cliente => {
                    this.form.patchValue(
                        {
                            nome: cliente.nome.toUpperCase(),
                            sobrenome: cliente.sobrenome.toUpperCase(),
                            nascimento: moment(cliente.dataNascimento.date).format('DD/MM/YYYY'),
                            sexo: cliente.genero.toUpperCase(),
                            cpf: cliente.cpf,
                            telefone: cliente.telefone,
                            email: cliente.email
                        }
                    );
                    if (cliente.endereco) {
                        const endereco: Endereco = cliente.endereco;
                        if (endereco.estado && endereco.cidade) {
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
                            this.form.get('estado').patchValue(this.estadoSelecionado);
                            this.form.get('cidade').patchValue(this.cidadeSelecionada);
                        }
                    }

                    this.showLoading = false;
                },
                error => {
                    this.handleError('Algo inesperado aconteceu. Tente novamente mais tarde.');
                }
            );
    }

    ngOnDestroy() {
        this.menuFooterService.setIsPagina(false);
    }

    createForm() {
        this.form = this.fb.group({
            nome: [{ value: '', disabled: true }],
            sobrenome: [{ value: '', disabled: true }],
            nascimento: [{ value: '', disabled: true }],
            sexo: [{ value: '', disabled: true }],
            cpf: [{ value: '', disabled: true }],
            telefone: ['', Validators.required],
            email: ['', Validators.required],
            logradouro: ['', Validators.required],
            numero: ['', Validators.required],
            bairro: ['', Validators.required],
            cidade: ['0', Validators.required],
            estado: ['0', Validators.required],
            cep: ['', Validators.required],
            senha_atual: [null, Validators.required]
        });
    }

    resetarForm() {
        this.showLoading = true;

        this.cidades = [];
        this.estadoSelecionado = 0;
        this.cidadeSelecionada = 0;

        this.loadCliente();
    }

    getCidades(event: any) {
        let estadoId = event.target.value;

        if (estadoId > 0) {
            this.utilsService.getCidades(event.target.value).subscribe(
                cidades => this.cidades = cidades,
                error => this.handleError(error)
            );
        }
    }

    buscarPorCep(event: any) {
        const cepValue = event.target.value;
        if (cepValue.length == 9) {
            this.utilsService.getEnderecoPorCep(cepValue).subscribe(
                (endereco: any) => {
                    if (!endereco.erro) {
                        let estadoLocal: Estado;
                        for (let estado of this.estados) {
                            if (estado.uf == endereco.uf) {
                                estadoLocal = estado;
                            }
                        }
                        this.estadoSelecionado = estadoLocal.id;
                        this.form.get('estado').patchValue(this.estadoSelecionado);
                        this.utilsService.getCidades(estadoLocal.id).subscribe(
                            cidades => {
                                this.cidades = cidades;
                                for (let cidade of this.cidades) {
                                    if (cidade.nome == endereco.localidade.toUpperCase()) {
                                        this.cidadeSelecionada = cidade.id;
                                        this.form.get('cidade').patchValue(this.cidadeSelecionada);
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
