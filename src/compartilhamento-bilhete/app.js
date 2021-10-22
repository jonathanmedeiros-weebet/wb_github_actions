document.onreadystatechange = async function() {
    if (this.readyState === 'complete') {
        const params = await getParams();
        if (params) {
            const appCssLink = document.getElementById('app-css');
            const linkTag = document.createElement('link');
            linkTag.href = `https://weebet.s3.amazonaws.com/${params.slug}/param/cores.css`
            linkTag.rel = 'stylesheet';
            appCssLink.parentElement.insertBefore(linkTag, appCssLink);

            const image = document.createElement('img');
            image.src = `https://weebet.s3.amazonaws.com/${params.slug}/logos/logo_banca.png`
            const logoDiv = document.getElementById('logo-frame');
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

                    div.innerHTML = `
                        <div class="ticket-item">
                            <div>
                                <strong>${ticketItem.campeonato_nome}</strong>
                            </div>
                            <div id="event-time">${new Date(ticketItem.jogo_horario).toLocaleString()}</div>
                            <div class="players">
                                <div class="player player-a-data" id="player-a-data">
                                <div class="player-name">
                                    <strong>${ticketItem.time_a_nome.toUpperCase()}</strong>
                                </div>
                                <div class="player-1half-result">${ ticketData.tipo == 'esportes' ? mappedResults  && mappedResults.casa_1t || '' : ticketItem.time_a_resultado_1t || ''}</div>
                                <div class="player-2half-result">${ ticketData.tipo == 'esportes' ? mappedResults  && mappedResults.casa_2t || '' : ticketItem.time_a_resultado_2t || ''}</div>
                                <div class="player-corner-kick"> ${ ticketData.tipo == 'esportes' ? mappedResults  && mappedResults.casa_escanteios || '' : ticketItem.time_a_resultado_escanteios || ''}</div>
                            </div>
                            <div class="separators">
                                <div>
                                    <strong>
                                        ${ ticketData.tipo === 'esportes' ? mappedResults && mappedResults.casa || '' : ticketItem.time_a_resultado || ''} 
                                        - 
                                        ${ ticketData.tipo === 'esportes' ? mappedResults && mappedResults.fora || '' : ticketItem.time_a_resultado || ''}
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
                                <div class="player-1half-result"> ${ ticketData.tipo === 'esportes' ? mappedResults && mappedResults.fora_1t || '' : ticketItem.time_b_resultado_1t || ''}</div>
                                <div class="player-2half-result"> ${ ticketData.tipo === 'esportes' ? mappedResults && mappedResults.fora_2t || '' : ticketItem.time_b_resultado_2t || ''}</div>
                                <div class="player-corner-kick">  ${ ticketData.tipo == 'esportes' ? mappedResults  && mappedResults.fora_escanteios || '' : ticketItem.time_b_resultado_escanteios || ''}</div>
                            </div>
                        </div>
                        <div id="final-resulst">Resultado Final:
                            <span></span>
                        </div>
                    </div>`;
                    document.getElementById('ticket-itens').appendChild(div);
                }
            }
        } else {
            console.error('page params are unavaliable');
        }
    }
}