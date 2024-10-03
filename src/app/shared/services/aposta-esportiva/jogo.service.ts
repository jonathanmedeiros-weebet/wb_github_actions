import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HeadersService } from './../utils/headers.service';
import { ErrorService } from './../utils/error.service';
import { Jogo, Cotacao, Campeonato } from './../../../models';
import { config } from '../../config';
type iBilheteEsportivo = {
    ao_vivo: boolean;
    jogo_id: string;
    jogo_event_id: string;
    jogo_nome: string;
    cotacao: {
        chave: string;
        valor: number;
    };
    jogo: {
        _id: string;
        event_id: string;
        nome: string;
        time_a_nome: string;
        time_a_img: string | null;
        time_b_nome: string;
        time_b_img: string | null;
        horario: string;
        ao_vivo: boolean;
        cancelado: boolean;
        finalizado: boolean;
    };
    campeonato: {
        _id: string;
        nome: string;
        alias: string | null;
        regiao: string;
        regiao_sigla: string;
        sport_id: string;
    };
    cotacoes: Array<{
        chave: string;
        valor: number;
        last_update: string;
        valorfinal: number;
        label: string;
    }>;
    mudanca: boolean;
    cotacao_antiga_valor: number | null;
};
@Injectable()
export class JogoService {
    private JogoUrl = `${config.CENTER_API}/jogos`;
    private JogosLokiUrl = `${config.LOKI_URL}/games`;

    constructor(
        private http: HttpClient,
        private header: HeadersService,
        private errorService: ErrorService
    ) { }

    getJogo(id: Number): Observable<any> {
        const url = `${this.JogoUrl}/${id}`;

        return this.http.get(url, this.header.getRequestOptions(true))
            .pipe(
                map((res: any) => res.result),
                catchError(this.errorService.handleError)
            );
    }

    verficarAoVivo(jogos): Observable<any> {
        const url = `${this.JogoUrl}/verificar-ao-vivo`;

        let params = new HttpParams({
            fromObject: { 'jogos[]': jogos }
        });

        return this.http.get(url, { params })
            .pipe(
                map((res: any) => res.result),
                catchError(this.errorService.handleError)
            )
    }

    getCotacoes(id: number): Observable<Cotacao[]> {
        const url = `${this.JogoUrl}/${id}/cotacoes`;

        return this.http.get(url, this.header.getRequestOptions(true))
            .pipe(
                map((res: any) => res.result),
                catchError(this.errorService.handleError)
            );
    }

    getJogosAoVivo() {
        const url = `${this.JogoUrl}/ao-vivo`;

        return this.http.get(url, this.header.getRequestOptions(true, {new_api: true}))
            .pipe(
                map((res: any) => res.result),
                catchError(this.errorService.handleError)
            );
    }

    getJogosDestaque() {
        const url = `${this.JogosLokiUrl}/highlighted-games`;

        return this.http.get(url, this.header.getRequestOptions(true))
            .pipe(
                map((res: any) => res),
                catchError(this.errorService.handleError)
            );
    }

    getCotacao(id: number, chave: string): Observable<Cotacao[]> {
        const url = `${this.JogoUrl}/${id}/cotacoes/${chave}`;

        return this.http.get(url, this.header.getRequestOptions(true))
            .pipe(
                map((res: any) => res.result),
                catchError(this.errorService.handleError)
            );
    }

    public async convertItemToBet(itens) {
        let convertedItemToBet: iBilheteEsportivo[] = [];

        const promises = itens.map(async (item) => {
            try {
                const res: any = await this.getCotacao(item.jogo_api_id, item.aposta_tipo.chave).toPromise();
                if (res.cotacao) {
                    convertedItemToBet.push({
                        ao_vivo: item.ao_vivo,
                        jogo_id: item.jogo_api_id,
                        jogo_event_id: item.jogo_api_id,
                        jogo_nome: `${item.time_a_nome} x ${item.time_b_nome}`,
                        cotacao: {
                            chave: item.aposta_tipo.chave,
                            valor: res.cotacao
                        },
                        jogo: {
                            _id: item.jogo_api_id,
                            event_id: item.jogo_api_id,
                            nome: `${item.time_a_nome} x ${item.time_b_nome}`,
                            time_a_nome: item.time_a_nome,
                            time_a_img: null,
                            time_b_nome: item.time_b_nome,
                            time_b_img: null,
                            horario: item.jogo_horario,
                            ao_vivo: item.ao_vivo,
                            cancelado: item.cancelado,
                            finalizado: item.finalizado
                        },
                        campeonato: {
                            _id: res.jogo.campeonato._id,
                            nome: res.jogo.campeonato.nome,
                            alias: null,
                            regiao: null,
                            regiao_sigla: null,
                            sport_id: item.sport
                        },
                        cotacoes: [
                            {
                                chave: item.aposta_tipo.chave,
                                valor: item.aposta_tipo.valor,
                                last_update: item.aposta_tipo.last_update,
                                valorfinal: item.aposta_tipo.valorfinal,
                                label: item.aposta_tipo.label
                            }
                        ],
                        mudanca: false,
                        cotacao_antiga_valor: null
                    });
                }
            } catch (err) {
                throw new Error('Falha ao converter item para aposta.');
            }
        });

        await Promise.all(promises);
        return convertedItemToBet;
    }
}
