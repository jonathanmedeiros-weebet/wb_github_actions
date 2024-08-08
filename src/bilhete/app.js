document.onreadystatechange = async function () {
    if (this.readyState === 'complete') {

        try {
            const params = await getParams();
            if (!params) {
                throw 'Impossível conectar ao servidor !'
            } else {
                const appCssLink = this.getElementById('app-css');
                const linkTag = this.createElement('link');
                const fieldLinkFootball = 'https://widgets-v2.thesports01.com/br/pro/football?profile=5oq66hkn0cwunq7&uuid=';
                const fieldLinkBasketball = 'https://widgets-v2.thesports01.com/br/pro/football?profile=5oq66hkn0cwunq7&uuid=';
                linkTag.href = `https://weebet.s3.amazonaws.com/${params.slug}/param/cores.css`
                linkTag.rel = 'stylesheet';
                appCssLink.parentElement.insertBefore(linkTag, appCssLink);

                const image = this.createElement('img');
                image.src = `https://weebet.s3.amazonaws.com/${params.slug}/logos/logo_banca.png`
                const logoDiv = this.getElementById('logo-frame');
                logoDiv.appendChild(image);

                var ticketData = await getTicketData({
                    apiUrl: params.center,
                    ticketId: params.ticketId
                });

                if (!ticketData.success) {
                    throw ticketData.message;
                } else {
                    ticketData = ticketData.results
                    const ticketItens = await orderTicketItens(ticketData.itens, ticketData.tipo);

                    ticketData.itens = ticketItens;

                    if (ticketData.tipo === 'esportes' || ticketData.tipo === 'desafio') {
                        this.getElementById('cash-back').append(ticketData.possibilidade_ganho.toLocaleString('pt-br', {
                            style: 'currency',
                            currency: 'BRL'
                        }));
                        this.getElementById('quotation').append((ticketData.possibilidade_ganho.toFixed(2) / ticketData.valor.toFixed(2)).toFixed(3).replace(/\.000$/, "").replace('.', ','));


                    } else {
                        this.getElementById('cash-back').parentNode.hidden = true;
                        this.getElementById('quotation').parentNode.hidden = true;
                        this.getElementById('result').parentNode.hidden = true;
                        if (ticketData.tipo === 'acumuladao') {
                            this.getElementById('number-hits').parentNode.hidden = false;
                            this.getElementById('number-hits').append(ticketData.quantidade_acertos || '')
                            this.getElementById('grouped-bets').parentNode.hidden = false;
                            this.getElementById('grouped-bets').append(ticketData.acumuladao.nome)
                        }
                    }

                    if (!ticketData.resultado || !ticketData.ativo) {
                        this.getElementById('has-result').style.display = 'none';
                    } else {
                        this.getElementById('result').append(ticketData.resultado);
                        this.getElementById('has-result').hidden = false;
                        ticketData.resultado !== 'a confirmar' ? this.getElementById('result').classList.add(ticketData.resultado.replace(' ', '-')) : 0;
                    }

                    if (ticketData.passador.percentualPremio > 0) {
                        var cambistaPaga = 0;

                        if (ticketData.resultado) {
                            cambistaPaga = ticketData.premio * ((100 - ticketData.passador.percentualPremio) / 100);
                        } else {
                            cambistaPaga = ticketData.possibilidade_ganho * ((100 - ticketData.passador.percentualPremio) / 100);
                        }

                        this.getElementById('agent-pays').append(cambistaPaga.toLocaleString('pt-br', {
                            style: 'currency',
                            currency: 'BRL'
                        }));
                    } else {
                        this.getElementById('agent-pays').parentNode.hidden = true;
                    }

                    if (ticketData.resultado && (ticketData.premio || ticketData.premio == 0)) {
                        this.getElementById('award').append(ticketData.premio.toLocaleString('pt-br', {
                            style: 'currency',
                            currency: 'BRL'
                        }));
                    } else {
                        this.getElementById('award').parentNode.hidden = true;
                    }

                    if (ticketData.tipo === 'desafio') {
                        this.getElementById('chalanges').hidden = false;
                        this.getElementById('games').hidden = true;
                    }

                    this.getElementById('ticket-id').append(ticketData.codigo);
                    this.getElementById('panter').append(ticketData.apostador.toUpperCase());
                    this.getElementById('money-changer').append(ticketData.passador.nome.toUpperCase());
                    this.getElementById('date').append(getFormatedDate(new Date(ticketData.horario.replace(/-/g, '/'))));
                    this.getElementsByClassName('itens-number')[0].append(ticketData.itens_ativos || ticketData.itens.length);
                    this.getElementsByClassName('itens-number')[1].append(ticketData.itens_ativos || ticketData.itens.length);
                    this.getElementById('bet-amount').append(ticketData.valor.toLocaleString('pt-br', {
                        style: 'currency',
                        currency: 'BRL'
                    }));
                    this.getElementById('bet-amount').append(ticketData.is_bonus ? ' (bônus)' : '');
                    this.getElementById('status').append(ticketData.ativo ? 'ATIVO' : 'CANCELADO')

                    const mapEsportes = new Map()
                    var isExpired = false;

                    if (ticketData.tipo === 'esportes') {
                        const ids = [];

                        for (const item of ticketData.itens) {
                            ids.push(item.jogo_api_id);
                        }

                        var results = await getResults(ids);
                        var itemsWithResults = [];

                        if (results) {
                            results = results.result;

                            results.forEach(item => {
                                ticketData.itens.map((game) => {
                                    if (game.jogo_api_id === item.event_id) {
                                        game.time_a_img = item.time_a_img;
                                        game.time_b_img = item.time_b_img;
                                    }
                                });

                                if (item.resultado){
                                    itemsWithResults.push(item.event_id);
                                }
                            });
                        } else {
                            throw results;
                        }

                        if (ticketData.resultado && (results.length == 0)) {
                            isExpired = true;
                        }
                        if (!isExpired) {
                            mapEsportes.clear();

                            results.forEach(result => {
                                mapEsportes.set(result.event_id, result.resultado);
                            });
                        } else {
                            throw 'Bilhete Expirado!'
                        }
                    }

                    for (var ticketItem of ticketData.itens) {
                        const templateData = {
                            player_a_result: '',
                            player_b_result: '',
                            player_a_1half_result: '',
                            player_b_1half_result: '',
                            player_a_2half_result: '',
                            player_b_2half_result: '',
                            player_a_corner_kicks: '',
                            player_b_corner_kicks: '',
                        };
                        var div = this.createElement('div');

                        if (ticketData.tipo === 'esportes') {
                            var mappedResults = mapEsportes.get(ticketItem.jogo_api_id);
                            if (mappedResults) {
                                templateData.player_a_result = mappedResults.casa;
                                templateData.player_a_1half_result = (mappedResults.casa_1t >= 0) ? mappedResults.casa_1t : '';
                                templateData.player_a_2half_result = (mappedResults.casa_2t >= 0) ? mappedResults.casa_2t : '';
                                templateData.player_a_corner_kicks = (mappedResults.casa_escanteios >= 0) ? mappedResults.casa_escanteios : '';

                                templateData.player_b_result = mappedResults.fora;
                                templateData.player_b_1half_result = (mappedResults.fora_1t >= 0) ? mappedResults.fora_1t : '';
                                templateData.player_b_2half_result = (mappedResults.fora_2t >= 0) ? mappedResults.fora_2t : '';
                                templateData.player_b_corner_kicks = (mappedResults.fora_escanteios >= 0) ? mappedResults.fora_escanteios : '';
                            } else if (ticketItem.resultado) {
                                templateData.player_a_result = ticketItem.time_a_resultado;
                                templateData.player_b_result = ticketItem.time_b_resultado;
                            }
                        } else if (ticketData.tipo === 'acumuladao') {
                            const result_a = ticketItem.jogo.time_a_resultado;
                            const result_b = ticketItem.jogo.time_b_resultado;
                            templateData.player_a_result = (result_a >= 0 && result_a != null) ? result_a : '';
                            templateData.player_b_result = (result_b >= 0 && result_a != null) ? result_b : '';
                        }

                        let hasResult = '';
                        const isCanceledOrFinished = {
                            status: false,
                            sitation: ''
                        };

                        if (ticketItem.encerrado || ticketItem.removido) {
                            isCanceledOrFinished.status = true
                            if (ticketItem.encerrado) {
                                isCanceledOrFinished.sitation = 'encerrado';
                            } else {
                                isCanceledOrFinished.sitation = 'cancelado';
                            }
                        }

                        if (ticketItem.resultado) {
                            hasResult = ticketItem.resultado;
                        }

                        if (ticketData.tipo == 'esportes') {
                            div.innerHTML = `
                            <div id="${ticketItem.jogo_api_id}_ticket_item" class="ticket-item">
                                <div class="identification">
                                    <strong>${ticketItem.campeonato_nome}</strong>
                                </div>
                                <div class="event-time">${getFormatedDate(new Date(ticketItem.jogo_horario.replace(/-/g, '/')))}</div>
                                <div id="match">
                                    <div>
                                        <div>
                                            <img src="https://cdn.wee.bet/img/times/m/${ticketItem.time_a_img}.png" onerror="this.src='https://cdn.wee.bet/img/times/m/default.png'">
                                        </div>
                                        <div>
                                            ${ticketItem.time_a_nome ? ticketItem.time_a_nome.toUpperCase() : ticketItem.odd_nome.toUpperCase()}
                                        </div>
                                    </div>

                                    <div class="time-live-score">
                                        <div class="aovivo-label blink" id="${ticketItem.jogo_api_id}_live_flag" hidden>Ao Vivo</div>

                                        <div id="${ticketItem.jogo_api_id}_scores" class="score">
                                            ${templateData.player_a_result} - ${templateData.player_b_result}
                                        </div>

                                        <div id="${ticketItem.jogo_api_id}_time" hidden class="time"></div>
                                    </div>

                                    <div>
                                        <div>
                                            <img src="https://cdn.wee.bet/img/times/m/${ticketItem.time_b_img}.png" onerror="this.src='https://cdn.wee.bet/img/times/m/default.png'">
                                        </div>
                                        <div>
                                            ${ticketItem.time_b_nome ? ticketItem.time_b_nome.toUpperCase() : ticketItem.odd_nome.toUpperCase()}
                                        </div>
                                    </div>
                                </div>
                                <div id="soccer-info" ${ticketItem.sport_nome !== 'Futebol' ? ' style="display: none;"' : ''}>
                                    <div id="first-half">
                                        <div id="${ticketItem.jogo_api_id}_1half_time_a">
                                            ${templateData.player_a_1half_result}
                                        </div>
                                        <div>
                                            Gols 1º Tempo
                                        </div>
                                        <div id="${ticketItem.jogo_api_id}_1half_time_b">
                                            ${templateData.player_b_1half_result}
                                        </div>
                                    </div>
                                    <div id="second-half">
                                        <div id="${ticketItem.jogo_api_id}_2half_time_a">
                                            ${templateData.player_a_2half_result}
                                        </div>
                                        <div>
                                            Gols 2º Tempo
                                        </div>
                                        <div id="${ticketItem.jogo_api_id}_2half_time_b">
                                            ${templateData.player_b_2half_result}
                                        </div>
                                    </div>
                                    <div id="corner-kicks">
                                        <div id="${ticketItem.jogo_api_id}_corner_time_a">
                                            ${templateData.player_a_corner_kicks}
                                        </div>
                                        <div>
                                            Escanteios
                                        </div>
                                        <div id="${ticketItem.jogo_api_id}_corner_time_b">
                                            ${templateData.player_b_corner_kicks}
                                        </div>
                                    </div>
                                </div>
                                <div class="dashed" id="final-resulst">${ticketItem.categoria_nome}: ${ticketItem.odd_nome} <strong>(${ticketItem.cotacao})</strong></div>
                                <div class="${isCanceledOrFinished.status == true ? isCanceledOrFinished.sitation : hasResult}">
                                ${isCanceledOrFinished.status == true ? isCanceledOrFinished.sitation : hasResult}</div>

                                <div id="${ticketItem.jogo_api_id}_live_status" class="live_status">
                                </div>

                                <div id="${ticketItem.jogo_api_id}_field" style="margin-top:18px">
                                </div>

                            </div>
                        </div>`;

                        } else if (ticketData.tipo === 'acumuladao') {
                            div.innerHTML =
                                `<div class="ticket-item">
                                <div class="event-time">${getFormatedDate(new Date(ticketItem.jogo.horario.replace(/-/g, '/')))}</div>
                                <div class="players">
                                    <div class="player player-a-data" id="player-a-data">
                                    <div class="player-name">
                                        <strong>${ticketItem.jogo.time_a_nome.toUpperCase()}</strong>
                                    </div>
                                </div>
                                <div class="separators">
                                    <div id="scores">
                                        <strong>
                                            ${templateData.player_a_result} - ${templateData.player_b_result}
                                        </strong>
                                    </div>
                                    <div id="palpite">Palpite: <span> ${ticketItem.time_a_resultado} x ${ticketItem.time_b_resultado}</span></div>
                                    <div class="${ticketItem.resultado}">${ticketItem.resultado || ''}</div>
                                    </div>
                                <div class="player player-b-data">
                                    <div class="player-name">
                                        <strong>${ticketItem.jogo.time_b_nome.toUpperCase()}</strong>
                                    </div>
                                </div>
                            </div>
                    </div>
                    `;
                        } else {
                            div.innerHTML =
                                `<div class="ticket-item">
                                    <div class="event-time">${getFormatedDate(new Date(ticketItem.desafio_datahora_encerramento.replace(/-/g, '/')))}</div>
                                    <div>
                                        ${ticketItem.desafio_categoria_nome}
                                    </div>
                                    <div >
                                        <strong>${ticketItem.desafio_nome}</strong>
                                    </div>
                                    <div  class="dashed">
                                        Resposta: ${ticketItem.odd_nome} (${ticketItem.cotacao})
                                    </div>
                                    <div class="${isCanceledOrFinished.status == true ? isCanceledOrFinished.sitation : hasResult}" >
                                    ${isCanceledOrFinished.status == true ? isCanceledOrFinished.sitation : hasResult}</div>
                                    </div>
                                </div>`;
                        }

                        if (ticketData.tipo === 'esportes' || ticketData.tipo === 'desafio') {
                            if (ticketItem.encerrado || ticketItem.removido) {
                                div.getElementsByClassName('dashed')[0].style.textDecoration = 'line-through'
                            }
                        }

                        this.getElementById('ticket-itens').appendChild(div);
                    }

                    for (let ticketItem of ticketData.itens) {
                        if (ticketItem.sport == 1 || ticketItem.sport == 18) {
                            async function insertIframe() {
                                const ticketDiv = document.getElementById(`${ticketItem.jogo_api_id}_ticket_item`);
                                const idLiveTracker = await getIdLiveTracker(ticketItem.jogo_api_id);
                                let fieldLink;
    
                                if (ticketItem.sport == 1) {
                                    fieldLink = fieldLinkFootball;
                                }
    
                                if (ticketItem.sport == 18) {
                                    fieldLink = fieldLinkBasketball;
                                }

                                if (ticketDiv) {
                                    ticketDiv.innerHTML += `
                                        <div id="${ticketItem.jogo_api_id}_field_body" class="field_body hidden_field">
                                            <div class="iframe-responsive">
                                                <iframe src="${fieldLink + idLiveTracker.result.live_track_id}" scrolling="no" frameborder="0"></iframe>
                                            </div>
                                        </div>
                                    `
                                }

                            };

                            insertIframe();
                        }
                    }
                    


                    var liveItems = ticketData.tipo === 'esportes' ? filterLiveItems(ticketItens, itemsWithResults) : [];

                    if (!ticketData.resultado && liveItems.length > 0) {
                        this.getElementById('follow-live').hidden = false;
                        this.getElementById('follow-live').addEventListener('click', function () {
                            document.getElementById('follow-live').hidden = true;
                            followLive(liveItems);
                        });
                    }
                }
                this.getElementById('ticket').hidden = false;
                this.getElementById('loader').hidden = true;

                if (params.origin == 'app') {
                    this.getElementById('link-retornar-site').hidden = false;
                }
            }
        } catch (error) {
            displayError(error);
        }
    } else {
        this.getElementById('loader').hidden = false;
    }
}
