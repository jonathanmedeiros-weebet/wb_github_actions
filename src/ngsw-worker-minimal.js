/* minimal-sw.js — não intercepta nada */
self.addEventListener('install', () => {
    // Ativa imediatamente a nova versão
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    // Assume controle das abas abertas
    event.waitUntil(self.clients.claim());
});

// Presença do listener 'fetch' satisfaz critérios de PWA,
// mas sem respondWith: não toca em nenhuma request.
self.addEventListener('fetch', () => { });