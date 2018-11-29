/* General Services */
export * from './shared/services/regra.service';
export * from './shared/services/parametros.service';

export * from './shared/services/loteria/aposta.service';
export * from './shared/services/loteria/preaposta-loteria.service';
export * from './shared/services/loteria/sorteio.service';
export * from './shared/services/loteria/tipo-aposta.service';

export * from './shared/services/aposta-esportiva/aposta-esportiva.service';
export * from './shared/services/aposta-esportiva/bilhete-esportivo.service';
export * from './shared/services/aposta-esportiva/campeonato.service';
export * from './shared/services/aposta-esportiva/cotacao.service';
export * from './shared/services/aposta-esportiva/jogo.service';
export * from './shared/services/aposta-esportiva/live.service';
export * from './shared/services/aposta-esportiva/preaposta-esportiva.service';

/* Utils Services */
export * from './shared/services/utils/cep.service';
export * from './shared/services/utils/error.service';
export * from './shared/services/utils/headers.service';
export * from './shared/services/utils/helper.service';
export * from './shared/services/utils/message.service';
export * from './shared/services/utils/print.service';
export * from './shared/services/utils/print.service';
export * from './shared/services/utils/sidebar.service';
export * from './shared/services/utils/surpresinha.service';

/* Authentication Services */
export * from './shared/services/auth/auth.service';

/* Guards */
export * from './shared/services/guards/auth.guard';
export * from './shared/services/guards/expires.guard';
export * from './shared/services/guards/parametros.resolver';
