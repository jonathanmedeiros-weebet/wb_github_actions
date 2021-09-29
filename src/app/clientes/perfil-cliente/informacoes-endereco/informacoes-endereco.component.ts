import {Component, OnInit} from '@angular/core';
import {BaseFormComponent} from '../../../shared/layout/base-form/base-form.component';
import {FormBuilder, Validators} from '@angular/forms';
import {ClienteService} from '../../../shared/services/clientes/cliente.service';
import {MessageService} from '../../../shared/services/utils/message.service';
import {Estado} from '../../../shared/models/endereco/estado';
import {Cidade} from '../../../shared/models/endereco/cidade';
import {UtilsService} from '../../../shared/services/utils/utils.service';
import {EnderecoWeebet} from '../../../shared/models/endereco/enderecoWeebet';

@Component({
    selector: 'app-informacoes-endereco',
    templateUrl: './informacoes-endereco.component.html',
    styleUrls: ['./informacoes-endereco.component.css']
})
export class InformacoesEnderecoComponent extends BaseFormComponent implements OnInit {
    estados: Array<Estado>;
    cidades: Array<Cidade>;
    estadoSelecionado: number;
    cidadeSelecionada: number;

    constructor(
        private fb: FormBuilder,
        private clienteService: ClienteService,
        private messageService: MessageService,
        private utilsService: UtilsService
    ) {
        super();
        this.cidades = [];
        this.estadoSelecionado = 0;
        this.cidadeSelecionada = 0;
    }

    ngOnInit(): void {
        this.createForm();
        this.utilsService.getEstados()
            .subscribe(
                estados => {
                    this.estados = estados;
                    const usuario = JSON.parse(localStorage.getItem('user'));
                    this.clienteService.getCliente(usuario.id)
                        .subscribe(
                            cliente => {
                                if (cliente) {
                                    const endereco: EnderecoWeebet = cliente.endereco;
                                    if (endereco) {
                                        this.form.patchValue(
                                            {
                                                logradouro: endereco.logradouro,
                                                numero: endereco.numero,
                                                bairro: endereco.bairro,
                                                cidade: endereco.cidade,
                                                cep: endereco.cep
                                            }
                                        );
                                        this.estadoSelecionado = endereco.estado.id;
                                        this.utilsService.getCidades(endereco.estado.id).subscribe(
                                            cidades => {
                                                this.cidades = cidades;
                                                this.cidadeSelecionada = endereco.cidade.id;
                                            },
                                            error => this.handleError(error));
                                    }
                                }
                            }
                        );
                    this.form.get('cep').valueChanges.subscribe(
                        (cepValue: string) => {
                            if (cepValue.length == 8) {
                                this.utilsService.pesquisarEnderecoPorCep(cepValue).subscribe(
                                    (endereco: any) => {
                                        if (!endereco.erro) {
                                            let estadoLocal: Estado;
                                            for (let estado of this.estados) {
                                                if (estado.uf == endereco.uf) {
                                                    estadoLocal = estado;
                                                }
                                            }
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
                                            this.estadoSelecionado = estadoLocal.id;
                                        } else {

                                            this.handleError('Endereço não encontrado, por favor preencha manualmente');
                                        }
                                    },
                                );
                            }
                        }
                    );
                }
            );
    }

    createForm() {
        this.form = this.fb.group({
            logradouro: [null, Validators.required],
            numero: [null, Validators.required],
            bairro: [null, Validators.required],
            cidade: [null, Validators.required],
            estado: [null, Validators.required],
            cep: [null, Validators.required],
            senha_atual: [null, Validators.required],
        });
    }

    getCidades(estado_id: any) {
        this.utilsService.getCidades(estado_id).subscribe(
            cidades => {
                this.cidades = cidades;
            },
            error => this.handleError(error));
    }

    handleError(error: string) {
        this.messageService.error(error);
    }

    submit() {
        const values = this.form.value;
        this.clienteService.atualizarEndereco(values)
            .subscribe(
                result => {
                    this.messageService.success('Endereço atualizado com sucesso');
                },
                error => this.handleError(error));
    }

}
