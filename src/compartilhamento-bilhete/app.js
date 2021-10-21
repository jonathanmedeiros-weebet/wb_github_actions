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
                console.log(ticketData);
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


                for (var ticketItem of ticketData.itens) {
                    var div = this.createElement('div');
                    div.innerHTML = `
                        <div class="ticket-item">
                            <div>
                                <strong>${ticketItem.campeonato_nome}</strong>
                            </div>
                            <div id="event-time">${ticketItem.jogo_horario}</div>
                            <div class="players">
                                <div class="player player-a-data" id="player-a-data">
                                <div class="player-name">
                                    <strong>${ticketItem.time_a_nome.toUpperCase()}</strong>
                                </div>
                                <div class="player-1half-result">${ticketItem.time_a_resultado_1t        || ''}</div>
                                <div class="player-2half-result">${ticketItem.time_a_resultado_2t        || ''}</div>
                                <div class="player-corner-kick">${ticketItem.time_a_resultado_escanteios || ''}</div>
                            </div>
                            <div class="separators">
                                <div>
                                    <strong>
                                        ${ticketItem.time_a_resultado || ''} - ${ticketItem.time_a_resultado || ''}
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
                                <div class="player-1half-result">${ticketItem.time_a_resultado_1t        || ''}</div>
                                <div class="player-2half-result">${ticketItem.time_a_resultado_2t        || ''}</div>
                                <div class="player-corner-kick">${ticketItem.time_a_resultado_escanteios || ''}</div>
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