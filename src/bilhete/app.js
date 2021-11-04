document.onreadystatechange = async function() {
    if (this.readyState === 'complete') {

        try {
            const params = await getParams();
            if (!params) {
                throw 'Impossível conectar ao servidor !'
            } else {
                const appCssLink = this.getElementById('app-css');
                const linkTag = this.createElement('link');
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
                        this.getElementById('cash-back').append(ticketData.possibilidade_ganho.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }));
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
                        ticketData.resultado !== 'a confirmar' ? this.getElementById('result').classList.add(ticketData.resultado) : 0;
                    }
                    if (ticketData.resultado && (ticketData.premio || ticketData.premio == 0)) {
                        this.getElementById('award').append(ticketData.premio.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }));
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
                    this.getElementById('date').append(getFormatedDate(new Date(ticketData.horario)));
                    this.getElementsByClassName('itens-number')[0].append(ticketData.itens_ativos || ticketData.itens.length);
                    this.getElementsByClassName('itens-number')[1].append(ticketData.itens_ativos || ticketData.itens.length);
                    this.getElementById('bet-amount').append(ticketData.valor.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }));
                    this.getElementById('status').append(ticketData.ativo ? 'ATIVO' : 'CANCELADO')

                    const mapEsportes = new Map()
                    var isExpired = false;

                    if (ticketData.tipo === 'esportes') {
                        const ids = [];

                        for (const item of ticketData.itens) {
                            ids.push(item.jogo_api_id);
                        }

                        var results = await getResuts(ids);

                        if (results) {
                            results = results.result;
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

                    for (var ticketItem of ticketData.itens) {
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
                            <div class="ticket-item">
                                <div>
                                    <strong>${ticketItem.campeonato_nome}</strong>
                                </div>
                                <div class="event-time">${new Date(ticketItem.jogo_horario).toLocaleString()}</div>
                                <div id="match">
                                    <div id="match-result">
                                        ${ticketItem.time_a_nome? ticketItem.time_a_nome.toUpperCase()
                                        : ticketItem.odd_nome.toUpperCase()}
                                    </div>
                                    <div>
                                        ${templateData.player_a_result} - ${templateData.player_b_result}
                                    </div>
                                    <div>
                                        ${ticketItem.time_b_nome? ticketItem.time_b_nome.toUpperCase() : ticketItem.odd_nome.toUpperCase()}
                                    </div>
                                </div>
                                <div id="first-half">
                                    <div>
                                        ${templateData.player_a_1half_result}
                                    </div>
                                    <div>
                                        Gols 1º Tempo
                                    </div>
                                    <div>
                                        ${templateData.player_b_1half_result}
                                    </div>
                                </div>
                                <div id="second-half">
                                    <div>
                                        ${templateData.player_a_2half_result}
                                    </div>
                                    <div>
                                        Gols 2º Tempo
                                    </div>
                                    <div>
                                        ${templateData.player_b_2half_result}
                                    </div>
                                </div>

                                <div id="corner-kicks">
                                    <div>
                                        ${templateData.player_a_corner_kicks}
                                    </div>
                                    <div>
                                        Escanteios
                                    </div>
                                    <div>
                                        ${templateData.player_b_corner_kicks}
                                    </div>
                                </div>
                                <div class="dashed" id="final-resulst">${ticketItem.categoria_nome}: ${ticketItem.odd_nome} <strong>(${ticketItem.cotacao})</strong></div>
                                <div class="${ isCanceledOrFinished.status == true ?  isCanceledOrFinished.sitation : hasResult}">
                                ${ isCanceledOrFinished.status == true ?  isCanceledOrFinished.sitation : hasResult  }</div>
                            </div>
                        </div>`;

                        } else if (ticketData.tipo === 'acumuladao') {

                            div.innerHTML =
                                `<div class="ticket-item">
                                <div class="event-time">${new Date(ticketItem.jogo.horario).toLocaleString()}</div>
                                <div class="players">
                                    <div class="player player-a-data" id="player-a-data">
                                    <div class="player-name">
                                        <strong>${ticketItem.jogo.time_a_nome.toUpperCase()  }</strong>
                                    </div>
                                </div>
                                <div class="separators">
                                    <div id="scores">
                                        <strong>
                                            ${templateData.player_a_result } - ${templateData.player_b_result }
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
                                    <div class="event-time">${new Date(ticketItem.desafio_datahora_encerramento).toLocaleString()}</div>
                                    <div>
                                        ${ticketItem.desafio_categoria_nome}
                                    </div>
                                    <div >
                                        <strong>${ticketItem.desafio_nome}</strong>
                                    </div>
                                    <div  class="dashed">
                                        Resposta: ${ticketItem.odd_nome} (${ticketItem.cotacao})
                                    </div>
                                    <div class="${ isCanceledOrFinished.status == true ?  isCanceledOrFinished.sitation : hasResult}" >
                                    ${ isCanceledOrFinished.status == true ?  isCanceledOrFinished.sitation : hasResult }</div>
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
                }
                this.getElementById('ticket').hidden = false;
                this.getElementById('loader').hidden = true;
            }
        } catch (error) {
            displayError(error);
        }
    } else {
        this.getElementById('loader').hidden = false;
    }
}
