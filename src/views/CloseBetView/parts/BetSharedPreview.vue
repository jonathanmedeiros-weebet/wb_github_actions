<template>
    <div class="bet-shared" ref="ticket">
        <div class="bet-shared__container">
            <div class="bet-shared__logo">
                <img :src="logoImage">
            </div>
            <h1 class="bet-shared__code">
                {{ betCode }}
            </h1>
            <hr>
            <hr>
            <div class="bet-shared__info">
                <div class="bet-shared__group-info">
                    <p>
                        <b>CAMBISTA:</b> {{ agentName }}
                    </p>
                    <p>
                        <b>APOSTADOR:</b> {{ bettorName }}
                    </p>
                    <p>
                        <b>HORÁRIO:</b> {{ betDateTime }}
                    </p>
                </div>
                <div class="bet-shared__group-info">
                    <p>
                        <b>Status: </b>
                        <span>{{ betStatus }}</span>
                    </p>
                    <p>
                        <b>RESULTADO: </b>
                        <span v-if="Boolean(betResult)">{{betResult}}</span>
                        <span v-if="Boolean(!betResult)">aguardando</span>
                    </p>
                </div>
            </div>
            <hr>
            <hr>
            <div class="bet-shared__itens">
                <div v-for="(item, index) of betItens" :key="index">
                    <div class="bet-shared__item" :class="{'bet-shared__item-even': (index % 2),'bet-shared__item-odd': !(index % 2)}">
                        <p class="bet-shared__championship">
                            {{ item.campeonato_nome }}
                        </p>
                        <p class="bet-shared__time">
                            {{ formatDateTimeBR(item.jogo_horario) }}
                        </p>
                        <p class="bet-shared__name" :class="{
                            'bet-shared__ganhou': !item?.removido ? item.resultado === 'ganhou' : false,
                            'bet-shared__perdeu': !item?.removido ? item.resultado === 'perdeu' : false,
                            'bet-shared__cancelado': item?.removido,
                        }">
                            {{ item.time_a_nome }}
                            {{ item.time_a_resultado }} x {{ item.time_b_resultado }}
                            {{ item.time_b_nome }}
                        </p>
                        <p class="bet-shared__quotes" :class="{
                            'bet-shared__ganhou': !item?.removido ? item.resultado === 'ganhou' : false,
                            'bet-shared__perdeu': !item?.removido ? item.resultado === 'perdeu' : false,
                            'bet-shared__cancelado': item?.removido,
                        }">
                            {{ item.categoria_nome }}:
                            {{ item.odd_nome }}
                            ( {{ item.cotacao }} )
                            <span v-if="item.ao_vivo"> | AO VIVO</span>
                        </p>
                        <p class="bet-shared__result">
                            <span v-if="item?.removido">cancelado</span>
                            <span v-if="!tem?.removido">{{ item.resultado }}</span>
                        </p>
                    </div>
                </div>
            </div>
            <hr>
            <div class="bet-shared__values">
                <p class="bet-shared__values-item">
                    <span>QUANTIDADE DE JOGOS:</span> <span>{{betItens.length}}</span>
                </p>
                <p class="bet-shared__values-item">
                    <span>COTAÇÃO:</span>
                    <span >{{ formatNumber(betQuote, 1, 3) }}</span>
                </p>
                <p class="bet-shared__values-item">
                    <span>VALOR APOSTADO:</span>
                    <span>{{ betValue }}</span>
                </p>
                <p class="bet-shared__values-item">
                    <span>POSSÍVEL RETORNO:</span>
                    <span>{{ betPossibility }}</span>
                </p>
                <p class="bet-shared__values-item" v-if="betResult == 'a confirmar'">
                    <span>PREMIO:</span>
                    <span>{{ betReward }}</span>
                </p>
                <p v-if="bet.passador.percentualPremio > 0" class="bet-shared__values-item">
                    <span>CAMBISTA PAGA:</span>
                    <span>{{ formatCurrency(cambistaPaga) }}</span>
                </p>
                <hr>
                <hr>
            </div>
            <p class="bet-shared__footer">
                {{ footerInfo }}
            </p> 
        </div>
    </div>
</template>
  
<script>
    import { useConfigClient } from '@/stores';
    import { formatCurrency, formatDateTimeBR } from '@/utilities';
  
    export default {
        name: 'bet-shared',
        components: { 
        },
        props: {
            bet: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                cambistaPaga: false
            }
        },
        mounted() {
            if (this.bet.passador.percentualPremio > 0) {
                if (this.bet.resultado) {
                    this.cambistaPaga = this.bet.premio * ((100 - this.bet.passador.percentualPremio) / 100);
                } else {
                    this.cambistaPaga = this.bet.possibilidade_ganho * ((100 - this.bet.passador.percentualPremio) / 100);
                }
            }
        },
        computed: {
            betCode() {
                return this.bet?.codigo ?? '';
            },
            bettorName() {
                return this.bet?.apostador ?? '';
            },
            agentName() {
                return this.bet?.passador?.nome ?? '';
            },
            betDateTime() {
                return this.bet?.horario ? formatDateTimeBR(this.bet?.horario) : '';
            },
            betStatus() {
                return this.bet?.ativo ? 'ATIVO' : 'CANCELADO';
            },
            betResult() {
                return this.bet?.resultado ?? '';
            },
            logoImage() {
                const { logo } = useConfigClient();
                return logo;
            },
            betItens() {
                return this.bet?.itens ?? [];
            },
            betQuote() {
                return this.bet.possibilidade_ganho / this.bet.valor
            },
            betValue() {
                return `R$ ${formatCurrency(this.bet.valor)}`
            },
            betPossibility() {
                return `R$ ${formatCurrency(this.bet?.possibilidade_ganho)}`
            },
            betReward() {
                return `R$ ${formatCurrency(this.bet?.premio)}`
            },
            footerInfo() {
                const { options } = useConfigClient();
                return options?.informativo_rodape ?? '';
            }
        },
        methods: {
            formatDateTimeBR,
            formatCurrency,
            formatNumber(value, minFractionDigits, maxFractionDigits) {
                return new Intl.NumberFormat('pt-BR', {
                    minimumFractionDigits: minFractionDigits,
                    maximumFractionDigits: maxFractionDigits
                }).format(value);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .bet-shared {
        
    }
</style>
  
  
  