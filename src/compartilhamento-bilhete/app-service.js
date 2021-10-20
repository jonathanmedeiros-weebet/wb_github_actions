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
    return await fetch(`http://${apiUrl}/api/apostas-por-codigo/${ticketId}`).then(
        response => {
            return response.json();
        }).catch(error => console.error(error));
}

async function orderTicketItens(tickeItens = []) {
    const orderedItens = tickeItens.sort((a, b) => {
        new Date(a.jogo_horario).getTime() - new Date(b.jogo_horario).getTime()
    });
    return orderedItens;
}