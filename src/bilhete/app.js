document.onreadystatechange = async function() {
    if (this.readyState === 'complete') {
        const params = await getParams();
        if (params) {
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
                displayError(ticketData.errors.message);
                console.error(ticketData.errors)
            } else {

                ticketData = ticketData.results
                const ticketItens = await orderTicketItens(ticketData.itens, ticketData.tipo);
                ticketData.itens = ticketItens;

                if (ticketData.tipo === 'esportes' || ticketData.tipo === 'desafio') {
                    this.getElementById('cash-back').append(ticketData.possibilidade_ganho.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }));
                    this.getElementById('quotation').append((ticketData.possibilidade_ganho.toFixed(2) / ticketData.valor.toFixed(2)));
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

                if (!ticketData.resultado || ticketData.resultado == 'a confirmar') {
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
                console.log(ticketData.horario)

                this.getElementById('ticket-id').append(ticketData.codigo);
                this.getElementById('panter').append(ticketData.apostador.toUpperCase());
                this.getElementById('money-changer').append(ticketData.passador.nome.toUpperCase());
                this.getElementById('date').append(getFormatedDate(new Date(ticketData.horario)));
                this.getElementsByClassName('itens-number')[0].append(ticketData.itens_ativos || ticketData.itens.length);
                this.getElementsByClassName('itens-number')[1].append(ticketData.itens_ativos || ticketData.itens.length);
                this.getElementById('bet-amount').append(ticketData.valor.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }));
                this.getElementById('status').append(ticketData.ativo ? 'ATIVO' : 'CANCELADO')

                const mapEsportes = new Map()
                if (ticketData.tipo === 'esportes') {
                    const ids = [];

                    for (const item of ticketData.itens) {
                        ids.push(item.jogo_api_id);
                    }
                    var isExpired = false;
                    var results = await getResuts(ids);
                    results = results.result;
                    console.log(results)

                    if (ticketData.resultado && (results.length == 0)) {
                        console.log('teste')
                        isExpired = true;
                    }
                    if (!isExpired) {
                        mapEsportes.clear();

                        results.forEach(result => {
                            mapEsportes.set(result.event_id, result.resultado);
                        });

                    } else {
                        displayError('Bilhete Expirado!')
                    }

                }
                for (var ticketItem of ticketData.itens) {
                    var div = this.createElement('div');
                    var mappedResults = mapEsportes.get(ticketItem.jogo_api_id);

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
                    console.log(mappedResults);

                    if (ticketData.tipo === 'esportes' && mappedResults) {
                        templateData.player_a_result = mappedResults.casa;
                        templateData.player_a_1half_result = (mappedResults.casa_1t <= 0) ? mappedResults.fora_escanteios : ''
                        templateData.player_a_2half_result = (mappedResults.casa_2t <= 0) ? mappedResults.fora_escanteios : ''
                        templateData.player_a_corner_kicks = (mappedResults.casa_escanteios <= 0) ? mappedResults.fora_escanteios : '';

                        templateData.player_b_result = mappedResults.fora;
                        templateData.player_b_1half_result = mappedResults.fora_1t;
                        templateData.player_b_2half_result = mappedResults.fora_2t;
                        templateData.player_b_corner_kicks = (mappedResults.fora_escanteios && (mappedResults.fora_escanteios <= 0)) ? mappedResults.fora_escanteios : '';
                    } else if (ticketData.tipo === 'acumuladao') {
                        const result_a = ticketItem.jogo.time_a_resultado;
                        const result_b = ticketItem.jogo.time_b_resultado;
                        templateData.player_a_result = (result_a >= 0) ? result_a : '';
                        templateData.player_b_result = (result_b >= 0) ? result_b : '';
                    }


                    if (ticketData.tipo == 'esportes') {

                        div.innerHTML = `
                        <div class="ticket-item">
                            <div>
                                <strong>${ticketItem.campeonato_nome}</strong>
                            </div>
                            <div class="event-time">${new Date(ticketItem.jogo_horario).toLocaleString()}</div>
                            <div class="players">
                                <div class="player player-a-data" id="player-a-data">
                                <div class="player-name">
                                    <strong>${ticketItem.time_a_nome? ticketItem.time_a_nome.toUpperCase() : ticketItem.odd_nome.toUpperCase()  }</strong>
                                </div>
                                <div class="player-1half-result">${templateData.player_a_1half_result}</div>
                                <div class="player-2half-result">${templateData.player_a_2half_result}</div>
                                <div class="player-corner-kick"> ${templateData.player_a_corner_kicks}</div>
                            </div>
                            <div class="separators">
                                <div id="scores">
                                    <strong>
                                        ${templateData.player_a_result} - ${templateData.player_b_result}
                                    </strong>    
                                </div>
                                <div>Gols 1º Tempo</div>
                                <div>Gols 2º Tempo</div>
                                <div>Escanteios</div>
                            </div>
                            <div class="player player-b-data">
                                <div class="player-name">
                                    <strong>${ticketItem.time_b_nome? ticketItem.time_b_nome.toUpperCase() : ticketItem.odd_nome.toUpperCase()}</strong>
                                </div>
                                <div class="player-1half-result"> ${templateData.player_b_1half_result}</div>
                                <div class="player-2half-result"> ${templateData.player_b_2half_result}</div>
                                <div class="player-corner-kick">  ${templateData.player_b_corner_kicks}</div>
                            </div>
                        </div>
                        <div id="final-resulst">${ticketItem.categoria_nome}: ${ticketItem.odd_nome} <strong>(${ticketItem.cotacao})</strong></div>
                        <div class="${ticketItem.resultado || ''}">${ticketItem.resultado ||''}</div>
                    </div>`;
                    } else if (ticketData.tipo === 'acumuladao') {
                        div.innerHTML =
                            `<div class="ticket-item">
                            <div class="event-time">${new Date(ticketItem.jogo.horario).toLocaleString()}</div>
                            <div>
                                <p>teste</p>
                            </div>
                            <div class="players">
                                <div class="player player-a-data" id="player-a-data">
                                <div class="player-name">
                                    <strong>${ticketItem.jogo.time_a_nome.toUpperCase()  }</strong>
                                </div>
                            </div>
                            <div class="separators">
                                <div id="scores">
                                    <strong>
                                        ${templateData.player_a_result} - ${templateData.player_b_result}
                                    </strong>    
                                </div>
                                <div>Palpite: <span> ${ticketItem.time_a_resultado} x ${ticketItem.time_b_resultado}</span></div>
                                <div >${ticketItem.resultado || ''}</div>
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
                         <div>
                            <strong>${ticketItem.desafio_nome}</strong>
                        </div>
                        <div>
                            Resposta: ${ticketItem.odd_nome} (${ticketItem.cotacao})
                        </div>
                        <div class="${ticketItem.resultado}" >${ticketItem.resultado || ''}</div>
                    </div>
            </div>`;
                    }
                    this.getElementById('ticket-itens').appendChild(div);
                }
            }
            this.getElementById('ticket').hidden = false;
        } else {

            displayError('Page params are unavaliable');
            console.error('page params are unavaliable');
        }
    }
}