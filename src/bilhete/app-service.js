async function getParams() {
    var url = window.location.pathname;

    var slug = 'demo.wee.bet';
    var centerUrl = 'central.' + slug;
    var ticketId = url.substring(url.lastIndexOf('/') + 1);

    if (ticketId && centerUrl && slug) {
        var params = {
            slug: slug,
            center: centerUrl,
            ticketId: ticketId
        };

        return params;
    } else {
        return false;
    }
}

async function getTicketData({ apiUrl, ticketId }) {
    try {
        const request = await fetch(`//${apiUrl}/api/apostas-por-codigo/${ticketId}`);
        const bet = await request.json();
        if (request.status == 404 || request.status == 500) {
            throw bet.errors;
        }
        return bet;
    } catch (error) {
        return error;
    }
}

async function orderTicketItens(tickeItens = [], ticketType) {
    const orderedItens = tickeItens.sort((a, b) => {
        switch (ticketType) {
            case 'acumuladao':
                return new Date(a.jogo.horario).getTime() - new Date(b.jogo.horario).getTime();
            case 'desafio':
                return new Date(a.desafio_datahora_encerramento).getTime() - new Date(b.desafio_datahora_encerramento).getTime();
            default:
                return new Date(a.jogo_horario).getTime() - new Date(b.jogo_horario).getTime()
        }
    });
    return orderedItens;
}

function getFormatedDate(date) {
    return moment(date).format("DD/MM/YYYY HH:mm");
}

async function getResuts(ids) {
    try {
        paramIds = ids.join(',');
        const request = await fetch(`https://center6.wee.bet/v1/resultados/puro?ids=${paramIds}`)
        const results = await request.json();

        if (request.status == 404 || request.status == 500) {
            throw results.errors;
        }
        return results;
    } catch (error) {
        return error;
    }
}

function displayError(message) {
    document.getElementById('error').hidden = false;
    document.getElementById('ticket').style.display = 'none';
    if (message) {
        console.error(message)
        if (message === 'Failed to Fetch') {
            document.getElementById('error-message').append('Imposível conectar ao servidor');
        } else {
            document.getElementById('error-message').append(message);
        }
    }
    document.getElementById('loader').hidden = true;
}
