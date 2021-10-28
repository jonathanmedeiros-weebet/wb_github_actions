async function getParams() {
    var paramsSearch = new URLSearchParams(window.location.search);
    var clientSlug = paramsSearch.get('client-slug');
    var centerUrl = paramsSearch.get('center');
    var ticketId = paramsSearch.get('ticket-id');
    const isAllPresent = (ticketId && centerUrl && clientSlug) ? true : false;
    return isAllPresent ? {
        slug: clientSlug,
        center: centerUrl,
        ticketId: ticketId
    } : false;
}

async function getTicketData({ apiUrl, ticketId }) {
    try {
        const request = await fetch(`https://${apiUrl}/api/apostas-por-codigo/${ticketId}`);
        const bet = await request.json();
        if (request.status == 404 || request.status == 500) {
            throw bet.errors;
        }
        return bet;
    } catch (error) {
        return error;
    }
}

async function orderTicketItens(tickeItens = [], ticketType = undefined) {
    const orderedItens = tickeItens.sort((a, b) => {
        switch (ticketType) {
            case 'acumuldao':
                new Date(a.jogo.horario).getTime() - new Date(b.jogo.horario).getTime()
                break;
            case 'desafio':
                new Date(a.desafio_datahora_encerramento).getTime() - new Date(b.desafio_datahora_encerramento).getTime()
                break;
            default:
                new Date(a.jogo_horario).getTime() - new Date(b.jogo_horario).getTime()
        }
    });
    return orderedItens;
}

function getFormatedDate(date) {
    var formatedDate = date.getDate().toString();
    var formatdMonth = date.getMonth() + 1;
    var formatedYear = date.getFullYear().toString();
    var hour = date.getHours();
    var minutes = date.getMinutes();

    var dateArray = [formatedDate, formatdMonth, formatedYear];
    var timeArray = [hour, minutes];
    return `${dateArray.join('/')} ${timeArray.join(':')}`;
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
    document.getElementById('error-message').append(message);
}