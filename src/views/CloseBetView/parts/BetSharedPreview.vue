<template>
    <div class="bet-shared" ref="ticket">
        <div class="bet-shared__container">
            <div class="bet-shared__logo">
                <img :src="logoImage" @error="changeSrcWhenImageError">
            </div>
            <h1 class="bet-shared__code">
                {{ betCode }}
            </h1>
            <hr>
            <hr>
            <div class="bet-shared__info">
                <div class="bet-shared__group-info">
                    <p>
                        <strong>CAMBISTA:</strong> {{ agentName }}
                    </p>
                    <p>
                        <strong>APOSTADOR:</strong> {{ bettorName }}
                    </p>
                    <p>
                        <strong>HORÁRIO:</strong> {{ betDateTime }}
                    </p>
                </div>
                <div class="bet-shared__group-info2">
                    <p>
                        <strong>Status: </strong>
                        <span>{{ betStatus }}</span>
                    </p>
                    <p>
                        <strong>RESULTADO: </strong>
                        <span v-if="Boolean(betResult)">{{betResult}}</span>
                        <span v-if="Boolean(!betResult)">aguardando</span>
                    </p>
                </div>
            </div>
            <hr>
            <hr>
            <div class="bet-shared__itens">
                <div
                    v-for="(item, index) of betItens"
                    :key="index"
                    class="bet-shared__item"
                    :class="{'bet-shared__item-even': (index % 2),'bet-shared__item-odd': !(index % 2)}"
                >
                    <p class="bet-shared__championship">
                        {{ item.campeonato_nome }}
                    </p>
                    <p class="bet-shared__time">
                        {{ formatDateTimeBR(item.jogo_horario) }}
                    </p>
                    <p class="bet-shared__name" :class="{
                        'bet-shared--ganhou': !item?.removido ? item.resultado === 'ganhou' : false,
                        'bet-shared--perdeu': !item?.removido ? item.resultado === 'perdeu' : false,
                        'bet-shared--cancelado': item?.removido,
                    }">
                        {{ item.time_a_nome }}
                        {{ item.time_a_resultado }} x {{ item.time_b_resultado }}
                        {{ item.time_b_nome }}
                    </p>
                    <p class="bet-shared__quotes" :class="{
                        'bet-shared--ganhou': !item?.removido ? item.resultado === 'ganhou' : false,
                        'bet-shared--perdeu': !item?.removido ? item.resultado === 'perdeu' : false,
                        'bet-shared--cancelado': item?.removido,
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
            <hr>
            <div class="bet-shared__values">
                <p class="bet-shared__values-item">
                    <strong>QUANTIDADE DE JOGOS:</strong> <strong>{{betItens.length}}</strong>
                </p>
                <p class="bet-shared__values-item">
                    <strong>COTAÇÃO:</strong>
                    <strong >{{ formatNumber(betQuote, 1, 3) }}</strong>
                </p>
                <p class="bet-shared__values-item">
                    <strong>VALOR APOSTADO:</strong>
                    <strong>{{ betValue }}</strong>
                </p>
                <p class="bet-shared__values-item">
                    <strong>POSSÍVEL RETORNO:</strong>
                    <strong>{{ betPossibility }}</strong>
                </p>
                <p class="bet-shared__values-item" v-if="betResult || betResult == 'a confirmar'">
                    <strong>PRÊMIO:</strong>
                    <strong>{{ betReward }}</strong>
                </p>
                <p v-if="bet?.passador?.percentualPremio > 0" class="bet-shared__values-item">
                    <strong>CAMBISTA PAGA:</strong>
                    <strong>{{ formatCurrency(cambistaPaga ?? 0) }}</strong>
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
            if (this.bet?.passador?.percentualPremio > 0) {
                if (this.bet?.resultado) {
                    this.cambistaPaga = this.bet?.premio * ((100 - this.bet?.passador?.percentualPremio) / 100);
                } else {
                    this.cambistaPaga = this.bet?.possibilidade_ganho * ((100 - this.bet?.passador?.percentualPremio) / 100);
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
                return this.bet?.possibilidade_ganho / this.bet?.valor
            },
            betValue() {
                return `R$ ${formatCurrency(this.bet?.valor ?? 0)}`
            },
            betPossibility() {
                return `R$ ${formatCurrency(this.bet?.possibilidade_ganho ?? 0)}`
            },
            betReward() {
                return `R$ ${formatCurrency(this.bet?.premio ?? 0)}`
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
            },
            changeSrcWhenImageError (event) {
                event.target.src = 'https://weebet.s3.amazonaws.com/demo.wee.bet/logos/logo_banca.png';
            }
        }
    }
</script>

<style lang="scss" scoped>
    .bet-shared {
        left: -10000px;
        position: absolute;
        width: 800px;
        padding: 1em;
        background: #f3f5d3;
        color: #1e282c;
        font-size: 12px;

        &--ganhou {
            color: var(--color-success)
        }

        &--perdeu {
            color: var(--color-danger)
        }

        &--cancelado {
            text-decoration: line-through
        }

        &__logo {
            display: flex;
        }
        &__logo img {
            margin: auto;
            max-height: 90px;
            max-width: 150px;
        }

        &__result span {
            font-size: 12px;
            font-weight: bold;
            margin: 0;
        }

        &__code {
            text-align: center;
            font-weight: bold;
            margin-bottom: 5px;
            margin-top:15px;
        }

        &__info {
            display: flex;
            margin: 10px 0;
        }

        &__info > div{
            width: 50%;
        }

        &__info p{
            margin: 1px;
            font-size: 12px;
        }

        &__itens {
            display: flex;
            flex-wrap:wrap;
        }

        &__item {
            margin-top: 5px;
            width: 50%;
            margin-bottom: 5px;
        }

        &__group-info {
            padding-right:10px;
        }

        &__group-info2 {
            padding-left: 10px;
            border-left: 1px dashed black;
        }

        &__championship {
            text-align: center;
            margin: 1px;
            font-weight: bold;
            font-size: 12px;
        }

        &__time {
            margin: 1px;
            font-size: 12px;
            text-transform: uppercase;
        }

        &__name {
            margin: 1px;
        }

        &__quotes {
            margin: 1px;
            font-size: 12px;
        }

        &__values-item {
            display: flex;
            justify-content: space-between;
            margin: 3px 1px 1px 1px;
            font-size: 12px;
        }

        &__footer {
            margin: 5px 1px 1px 1px;
            font-weight: normal;
            font-size: 12px;
            text-align: center;
        }

        &__item-odd{
            padding-right:10px;
        }

        &__item-even{
            padding-left:10px;
            border-left: 1px dashed black;
        }
    }

    hr {
        margin-top: 5px;
        margin-bottom: 5px;
        border: 1px dashed black;
    }

    strong {
        font-weight: 600;
    }
</style>
  
  
  