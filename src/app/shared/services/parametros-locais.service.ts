import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import {config} from '../config';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})
export class ParametrosLocaisService {
    parametrosLocais;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private http: HttpClient,
        private translate: TranslateService
    ) { }

    load() {
        return new Promise((resolve, reject) => {
            const time = + new Date();
            const paramUri = `https://weebet.s3.amazonaws.com/${config.SLUG}/param/parametros.json?${time}`;
            return this.http.get(paramUri)
                .subscribe((response: any) => {
                    this.parametrosLocais = response;

                    const GTM_ID = response?.opcoes?.gtm_id_site
                    const head = this.document.getElementsByTagName('head')[0];
                    const body = this.document.getElementsByTagName('body')[0];

                    if (GTM_ID) {

                        const GTMScriptHead = this.document.createElement('script');
                        GTMScriptHead.innerHTML = `
                            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                            })(window,document,'script','dataLayer','${GTM_ID}');
                        `;

                        const GTMScriptBody = this.document.createElement('noscript');
                        GTMScriptBody.innerHTML = `
                            <iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
                            height="0" width="0" style="display:none;visibility:hidden"></iframe>
                        `;

                        head.appendChild(GTMScriptHead);
                        body.prepend(GTMScriptBody);
                    }

                    const LEGITIMUZ_ENABLED = Boolean(response?.opcoes?.faceMatch && response?.opcoes?.legitimuz_token && response?.opcoes?.faceMatchType == 'legitimuz');
                    if (LEGITIMUZ_ENABLED) {
                        const LegitimuzScripSDK = this.document.createElement('script');
                        LegitimuzScripSDK.src = 'https://cdn.legitimuz.com/js/sdk/legitimuz-sdk.js';
                        const LegitimuzScripSDKFaceIndex = this.document.createElement('script');
                        LegitimuzScripSDKFaceIndex.src = 'https://cdn.legitimuz.com/js/sdk/faceindex.js';

                        head.appendChild(LegitimuzScripSDK);
                        head.appendChild(LegitimuzScripSDKFaceIndex);
                    }

                    const DOCK_CHECK_ENABLED = Boolean(response?.opcoes?.faceMatch && response?.opcoes?.dockCheck_token && response?.opcoes?.faceMatchType == 'docCheck');
                    if (DOCK_CHECK_ENABLED) {
                        const DockCheckScripSDK = this.document.createElement('script');
                        DockCheckScripSDK.innerHTML = `window.ex_partner = {ex_doccheck_identity_key_id: "${response?.opcoes?.dockCheck_key_id}",};
                            (function (w, d, src){var h = d.getElementsByTagName("head")[0];
                                var s=d.createElement("script"); s.src = src;
                                if (!w.exDocCheck) h.appendChild(s);
                                
                            })(window, document, "https://doccheck.exato.digital/doccheck.js");
                        `;
                        head.appendChild(DockCheckScripSDK);
                    }

                    const XTREMEPUSH_SDK_KEY = response?.opcoes?.xtreme_push_sdk_key
                    if (XTREMEPUSH_SDK_KEY) {
                        const head = this.document.getElementsByTagName('head')[0];

                        const XTREMEPUSH_SDKScriptHead = this.document.createElement('script');
                        XTREMEPUSH_SDKScriptHead.innerHTML = `
                              (function(p,u,s,h,e,r,l,i,b) {p['XtremePushObject']=s;p[s]=function(){
                                (p[s].q=p[s].q||[]).push(arguments)};i=u.createElement('script');i.async=1;
                                i.src=h;b=u.getElementsByTagName('script')[0];b.parentNode.insertBefore(i,b);
                              })(window,document,'xtremepush','https://us.webpu.sh/${XTREMEPUSH_SDK_KEY}/sdk.js');
                        `;

                        head.appendChild(XTREMEPUSH_SDKScriptHead);
                    }

                    resolve(true);
                });
        });
    }

    getParametros(): Observable<any> {
        const time = + new Date();
        const paramUri = `https://weebet.s3.amazonaws.com/${config.SLUG}/param/parametros.json?${time}`;
        return this.http.get(paramUri)
            .pipe(
                tap(parametrosLocais => this.parametrosLocais = parametrosLocais)
            );
    }

    getCampeonatosBloqueados(sportId) {
        const sport = 'sport_' + sportId;
        return this.parametrosLocais ? Object.assign([], this.parametrosLocais.campeonatos_bloqueados[sport]) : null;
    }

    getCampeonatosAoVivo() {
        return this.parametrosLocais ? Object.assign([], this.parametrosLocais.campeonatos_aovivo) : null;
    }

    getCampeonatosPrincipais() {
        return this.parametrosLocais ? Object.assign([], this.parametrosLocais.campeonatos_principais) : null;
    }
    getCotacoesLocais() {
        return this.parametrosLocais ? Object.assign([], this.parametrosLocais.cotacoes_local) : null;
    }

    getDataLimiteTabela() {
        return this.parametrosLocais ? this.parametrosLocais.opcoes.data_limite_tabela : null;
    }

    getJogosBloqueados() {
        return this.parametrosLocais ? Object.assign([], this.parametrosLocais.jogos_bloqueados) : null;
    }

    getOddsPrincipais() {
        return this.parametrosLocais ? Object.assign([], this.parametrosLocais.odds_principais) : null;
    }

    getLigasPopulares() {
        return this.parametrosLocais ? Object.assign([], this.parametrosLocais.ligas_populares) : null;
    }

    getTiposAposta() {
        let result = null;
        const isLoggedIn = !!localStorage.getItem('token');

        if (isLoggedIn && localStorage.getItem('tipos_aposta')) {
            const tiposAposta = JSON.parse(localStorage.getItem('tipos_aposta'));
            if (tiposAposta) {
                result = tiposAposta;
            }
        } else {
            if (this.parametrosLocais) {
                result = this.parametrosLocais.tipos_aposta;
            }
        }

        return result;
    }

    getOpcoes() {
        return this.parametrosLocais ? Object.assign({}, this.parametrosLocais.opcoes) : null;
    }

    getInformativoRodape() {
        return this.parametrosLocais ? this.parametrosLocais.opcoes.informativo_rodape : null;
    }

    getSeninhaNome() {
        return this.parametrosLocais ? this.parametrosLocais.opcoes.seninha_nome : null;
    }

    getQuininhaNome() {
        return this.parametrosLocais ? this.parametrosLocais.opcoes.quininha_nome : null;
    }

    seninhaAtiva() {
        return this.parametrosLocais ? this.parametrosLocais.opcoes.seninha_ativa : null;
    }

    quininhaAtiva() {
        return this.parametrosLocais ? this.parametrosLocais.opcoes.quininha_ativa : null;
    }

    loteriaPopularAtiva() {
        return this.parametrosLocais ? this.parametrosLocais.opcoes.loteriaPopular : null;
    }

    aoVivoAtivo(): boolean {
        return (this.futebolAoVivoAtivo() || this.basqueteAoVivoAtivo());
    }

    futebolAoVivoAtivo() {
        return this.parametrosLocais ? this.parametrosLocais.opcoes.futebol_aovivo : null;
    }

    basqueteAoVivoAtivo() {
        return this.parametrosLocais ? this.parametrosLocais.opcoes.basquete_aovivo : null;
    }

    getBancaNome() {
        return this.parametrosLocais ? this.parametrosLocais.opcoes.banca_nome : null;
    }

    getOddsImpressao() {
        const tiposAposta = this.getTiposAposta();
        const oddsImpressao = [];
        for (const key in tiposAposta) {
            if (tiposAposta.hasOwnProperty(key)) {
                const tipoAposta = tiposAposta[key];
                if (parseInt(tipoAposta.exibirImpressao, 10)) {
                    oddsImpressao.push(key);
                }
            }
        }
        return oddsImpressao;
    }

    getExibirCampeonatosExpandido() {
        return this.parametrosLocais ? this.parametrosLocais.opcoes.exibir_campeonatos_expandido : null;
    }

    controlarCreditoCambista() {
        return this.parametrosLocais ? this.parametrosLocais.opcoes.controlar_credito_cambista : null;
    }

    modoContaCorrente() {
        return this.parametrosLocais ? this.parametrosLocais.opcoes.modo_conta_corrente : null;
    }

    quantidadeMinEventosBilhete() {
        return this.parametrosLocais ? this.parametrosLocais.opcoes.quantidade_min_jogos_bilhete : null;
    }

    quantidadeMaxEventosBilhete() {
        return this.parametrosLocais ? this.parametrosLocais.opcoes.quantidade_max_jogos_bilhete : null;
    }

    minutoEncerramentoAoVivo() {
        return this.parametrosLocais ? this.parametrosLocais.opcoes.minuto_encerramento_aovivo : null;
    }

    bloquearCotacaoMenorQue() {
        return this.parametrosLocais ? (this.parametrosLocais.opcoes.bloquear_cotacao_menor_que || 1.05) : null;
    }

    getOddsBasqueteAtivas() {
        const tiposAposta = this.getTiposAposta();
        const oddsBasquete = ['bkt_casa', 'bkt_fora', 'bkt_total_pontos_par', 'bkt_total_pontos_impar'];
        const oddsBasqueteAtivas = [];

        for (const j in tiposAposta) {
            if (tiposAposta.hasOwnProperty(j)) {
                for (const k of oddsBasquete) {
                    if (k === j) {
                        oddsBasqueteAtivas.push(k);
                    }
                }
            }
        }

        return oddsBasqueteAtivas;
    }

    indiqueGanheHabilitado() {
        return this.parametrosLocais ? this.parametrosLocais.opcoes.indique_ganhe_habilitado : null;
    }

    cashbackEnabled() {
        return this.parametrosLocais ? this.parametrosLocais.opcoes.cashback_enabled : null;
    }

    barraIndiqueGanhe() {
        return this.parametrosLocais ? this.parametrosLocais.opcoes.barra_indique_ganhe : null;
    }

    sharedURL() {
        return this.parametrosLocais ? this.parametrosLocais.opcoes.shared_url : null;
    }

    getCustomCasinoName(wordToReplace: string = '', casinoDefault: string = this.translate.instant('geral.cassino')) {
        const currentLang = this.translate.currentLang;

        let customCasinoName = this.getOpcoes()?.custom_casino_name;
        customCasinoName = customCasinoName[currentLang] ?? casinoDefault;

        return wordToReplace
            ? wordToReplace.replace(casinoDefault, customCasinoName)
            : customCasinoName;
    }

    getSIGAPHabilitado() {
        return this.parametrosLocais ? this.parametrosLocais.opcoes.SIGAP_habilitado : null;
    }

    getAllowOnlyOneSessionPerLogin() {
        return this.parametrosLocais ? this.parametrosLocais.opcoes.allow_single_session : null;
    }

    isMandatoryPhoneValidation() {
        return this.parametrosLocais ? this.parametrosLocais.opcoes.mandatory_phone_validation : false;
    }

    getRestrictionStateBet() {
        return this.parametrosLocais ? this.parametrosLocais.opcoes.restriction_state_bet : false;
    }

    getEnableRequirementPermissionRetrieveLocation() {
        return this.parametrosLocais ? this.parametrosLocais.opcoes.enable_requirement_of_permission_to_retrieve_location : false;
    }
}
