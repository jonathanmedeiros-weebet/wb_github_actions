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
                const ticketItens = await orderTicketItens(ticketData.itens);
                ticketData.itens = ticketItens;

                this.getElementById('ticket-id').append(ticketData.codigo);
                this.getElementById('panter').append(ticketData.apostador.toUpperCase());
                this.getElementById('money-changer').append(ticketData.passador.nome.toUpperCase());
                this.getElementById('date').append(getFormatedDate(new Date(ticketData.horario)));
                this.getElementById('itens-number').append(ticketData.itens_ativos);
                this.getElementById('quotation').append((ticketData.possibilidade_ganho.toFixed(2) / ticketData.valor.toFixed(2)).toFixed(2))
                this.getElementById('bet-amount').append(ticketData.valor);
                this.getElementById('cash-back').append(ticketData.possibilidade_ganho.toFixed(2));
                this.getElementById('award').append(ticketData.premio);
                this.getElementById('status').append(ticketData.ativo ? 'ATIVO' : 'CANCELADO')
                if (!ticketData.resultado && ticketData.resultado == 'a confirmar') {
                    this.getElementById('has-result').style.display = 'none';
                } else {
                    this.getElementById('result').append(ticketData.resultado);
                    ticketData.resultado != 'a confirmar' ? this.getElementById('result').classList.add(ticketData.resultado) : 0;
                }
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
                    console.log(ticketItem);
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
                    } else {
                        templateData.player_a_result = ticketItem.time_a_resultado || mappedResults.casa === 0 || '';
                        templateData.player_a_1half_result = ticketItem.time_a_resultado_1t || mappedResults.casa_1t === 0 ? 0 : '';
                        templateData.player_a_2half_result = ticketItem.time_a_resultado_2t || mappedResults.casa_2t === 0 ? 0 : '';
                        templateData.player_a_corner_kicks = ticketItem.time_a_resultado_escanteios || ticketItem.time_a_resultado_escanteios === 0 ? 0 : '';

                        templateData.player_b_result = ticketItem.time_b_resultado || ticketItem.time_b_resultado === 0 ? 0 : '';
                        templateData.player_b_1half_result = ticketItem.time_b_resultado_1t || ticketItem.time_b_resultado_1t === 0 ? 0 : '';
                        templateData.player_b_2half_result = ticketItem.time_b_resultado_2t || ticketItem.time_b_resultado_2t === 0 ? 0 : '';
                        templateData.player_b_corner_kicks = ticketItem.time_b_resultado_escanteios || ticketItem.time_b_resultado_escanteios === 0 ? 0 : '';
                    }

                    div.innerHTML = `
                        <div class="ticket-item">
                            <div>
                                <strong>${ticketItem.campeonato_nome}</strong>
                            </div>
                            <div class="event-time">${new Date(ticketItem.jogo_horario).toLocaleString()}</div>
                            <div class="players">
                                <div class="player player-a-data" id="player-a-data">
                                <div class="player-name">
                                    <strong>${ticketItem.time_a_nome.toUpperCase()}</strong>
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
                                    <strong>${ticketItem.time_b_nome.toUpperCase()}</strong>
                                </div>
                                <div class="player-1half-result"> ${templateData.player_b_1half_result}</div>
                                <div class="player-2half-result"> ${templateData.player_b_2half_result}</div>
                                <div class="player-corner-kick">  ${templateData.player_b_corner_kicks}</div>
                            </div>
                        </div>
                        <div id="final-resulst">${ticketItem.categoria_nome}: ${ticketItem.odd_nome} <strong>(${ticketItem.cotacao})</strong></div>
                        <div class="${ticketItem.resultado || 0}">${ticketItem.resultado || 0}</div>
                    </div>`;
                    this.getElementById('ticket-itens').appendChild(div);
                }
            }
        } else {
            console.error('page params are unavaliable');
        }
    }
}