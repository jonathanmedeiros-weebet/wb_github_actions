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
                console.error(ticketData.errors)
            } else {

                ticketData = ticketData.results
                const ticketItens = await orderTicketItens(ticketData.itens, ticketData.tipo);
                ticketData.itens = ticketItens;

                if (ticketData.tipo === 'esportes') {
                    this.getElementById('cash-back').append(ticketData.possibilidade_ganho.toFixed(2));
                    this.getElementById('quotation').append((ticketData.possibilidade_ganho.toFixed(2) / ticketData.valor.toFixed(2)).toFixed(2))
                } else {
                    this.getElementById('cash-back').parentNode.hidden = true;
                    this.getElementById('quotation').parentNode.hidden = true;
                    this.getElementById('result').parentNode.hidden = true;
                    if (ticketData.tipo === 'acumuladao') {
                        this.getElementById('number-hits').parentNode.hidden = false;
                        this.getElementById('number-hits').append(ticketData.quantidade_acertos || '')
                    }

                }
                if (!ticketData.resultado && ticketData.resultado == 'a confirmar') {
                    this.getElementById('has-result').style.display = 'none';
                } else {
                    this.getElementById('result').append(ticketData.resultado);
                    this.getElementById('has-result').hidden = false;
                    ticketData.resultado !== 'a confirmar' ? this.getElementById('result').classList.add(ticketData.resultado) : 0;
                }
                if (ticketData.premio) {
                    this.getElementById('award').append(ticketData.premio);
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
                this.getElementsByClassName('itens-number')[0 || 1].append(ticketData.itens_ativos || ticketData.itens.length);
                this.getElementById('bet-amount').append(ticketData.valor);
                this.getElementById('status').append(ticketData.ativo ? 'ATIVO' : 'CANCELADO')

                const mapEsportes = new Map()
                if (ticketData.tipo === 'esportes') {
                    const ids = [];

                    for (const item of ticketData.itens) {
                        ids.push(item.jogo_api_id);
                    }
                    var isExpired = false;;
                    var results = await getResuts(ids);
                    results = results.result;

                    if (mapEsportes.resultado && (ticketData.resultado.length == 0)) {
                        isExpired = true;
                    }
                    if (!isExpired) {
                        mapEsportes.clear();


                        results.forEach(result => {
                            mapEsportes.set(result.event_id, result.resultado);
                        });

                    }

                }
                for (var ticketItem of ticketData.itens) {
                    var div = this.createElement('div');
                    var mappedResults = mapEsportes.get(ticketItem.jogo_api_id);

                    const templateData = {
                        player_a_result: null,
                        player_b_result: null,
                        player_a_1half_result: null,
                        player_b_1half_result: null,
                        player_a_2half_result: null,
                        player_b_2half_result: null,
                        player_a_corner_kicks: null,
                        player_b_corner_kicks: null,
                    };

                    if (ticketData.tipo === 'esportes' && mappedResults) {
                        templateData.player_a_result = mappedResults.casa || mappedResults.casa === 0 ? 0 : '';
                        templateData.player_a_1half_result = mappedResults.casa_1t || mappedResults.casa_1t === 0 ? 0 : '';
                        templateData.player_a_2half_result = mappedResults.casa_2t || mappedResults.casa_2t === 0 ? 0 : '';
                        templateData.player_a_corner_kicks = mappedResults.casa_escanteios || mappedResults.casa_escanteios === 0 ? 0 : '';

                        templateData.player_b_result = mappedResults.fora || mappedResults.fora === 0 ? 0 : '';
                        templateData.player_b_1half_result = mappedResults.fora_1t || mappedResults.fora_1t === 0 ? 0 : '';
                        templateData.player_b_2half_result = mappedResults.fora_2t || mappedResults.fora_2t === 0 ? 0 : '';
                        templateData.player_b_corner_kicks = mappedResults.fora_escanteios || mappedResults.fora_escanteios === 0 ? 0 : '';
                    } else if (ticketData.tipo === 'acumuladao') {

                        templateData.player_a_result = ticketItem.jogo.time_a_resultado;
                        templateData.player_b_result = ticketItem.jogo.time_b_resultado;
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
                                <div class="player-2half-result">${templateData.player_a_2half_result }</div>
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
                        <div class="${ticketItem.resultado || 0}">${ticketItem.resultado || 0}</div>
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
                                        ${templateData.player_a_result} - ${templateData.player_b_result}
                                    </strong>    
                                </div>
                                <div>Palpite: <span> ${ticketItem.time_a_resultado} x ${ticketItem.time_b_resultado}</span></div>
                                <div>${ticketItem.resultado}</div>
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

                        console.log(ticketData)

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
                        <div class="${ticketItem.resultado}" >${ticketItem.resultado}</div>
                    </div>
            </div>`;
                    }
                    this.getElementById('ticket-itens').appendChild(div);
                }
            }
        } else {
            console.error('page params are unavaliable');
        }
    }
}