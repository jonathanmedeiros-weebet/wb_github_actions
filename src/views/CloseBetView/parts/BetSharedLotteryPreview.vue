<template>
  <div class="bet-shared" ref="ticket">
    <div class="bet-shared__container">
      <div class="bet-shared__logo">
        <img v-if="logo" :src="logo">
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
          <p>
            <strong>MODALIDADE:</strong> {{ modality }}
          </p>
        </div>
      </div>
      <hr>
      <hr>
      <div v-for="(item, index) in betItems" :key="index" class="bet-shared__item">
        <p><strong>SORTEIO:</strong> {{ item.sorteio_nome }}</p>
        <p><strong>VALOR:</strong> {{ formatCurrency(item.valor) }}</p>
        <template v-if="modality === 'seninha'">
          <p v-if="item.cotacao6 > 0"><strong>RETORNO 6:</strong>
            {{ formatCurrency(calculateLotteryPrize(item.valor, item.cotacao6)) }}</p>
        </template>
        <template v-else>
          <p v-if="item.cotacao5 > 0"><strong>RETORNO 5:</strong>
            {{ formatCurrency(calculateLotteryPrize(item.valor, item.cotacao5)) }}</p>
          <p v-if="item.cotacao4 > 0"><strong>RETORNO 4:</strong>
            {{ formatCurrency(calculateLotteryPrize(item.valor, item.cotacao4)) }}</p>
          <p v-if="item.cotacao3 > 0"><strong>RETORNO 3:</strong>
            {{ formatCurrency(calculateLotteryPrize(item.valor, item.cotacao3)) }}</p>
        </template>
        <p><strong>DEZENAS:</strong> {{ item.numeros.join(', ') }}</p>
        <p><strong>STATUS:</strong> {{ item.status }}</p>
      </div>
      <hr>
      <div class="bet-shared__total">
        <p><strong>VALOR TOTAL:</strong> {{ betValue }}</p>
      </div>
      <p class="bet-shared__footer">
        {{ footerInfo }}
      </p>
    </div>
  </div>
</template>

<script>
import {getLogoTicket} from '@/services';
import {useConfigClient} from '@/stores';
import {formatCurrency, formatDateTimeBR} from '@/utilities';

export default {
  name: 'lottery-ticket',
  props: {
    bet: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      logo: null,
    };
  },
  async created() {
    try {
      const imageBase64 = await getLogoTicket();
      this.logo = imageBase64 ? `data:image/png;base64,${imageBase64}` : null;
    } catch {
      this.logo = null;
    }
  },
  computed: {
    betItems() {
      return this.bet?.itens ?? [];
    },
    betCode() {
      return this.bet?.codigo ?? '';
    },
    agentName() {
      return this.bet?.passador?.nome ?? '';
    },
    bettorName() {
      return this.bet?.apostador ?? '';
    },
    betDateTime() {
      return this.bet?.horario ? formatDateTimeBR(this.bet.horario) : '';
    },
    modality() {
      return this.bet?.modalidade ?? '';
    },
    betValue() {
      return `R$ ${formatCurrency(this.bet?.valor ?? 0)}`;
    },
    footerInfo() {
      const {options} = useConfigClient();
      return options?.informativo_rodape ?? '';
    },
  },
  methods: {
    formatCurrency,
    calculateLotteryPrize(valor, cotacao) {
      return valor * cotacao;
    },
  },
};
</script>


<style lang="scss" scoped>
.bet-shared {
  width: 800px;
  padding: 1em;
  background: #f3f5d3;
  color: #1e282c;
  font-size: 12px;

  &--ganhou {
    color: var(--success)
  }

  &--perdeu {
    color: var(--warning)
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
    margin-top: 15px;
  }

  &__info {
    display: flex;
    margin: 10px 0;
  }

  &__info > div {
    width: 50%;
  }

  &__info p {
    margin: 1px;
    font-size: 12px;
  }

  &__itens {
    display: flex;
    flex-wrap: wrap;
  }

  &__item {
    margin-top: 5px;
    width: 50%;
    margin-bottom: 5px;
  }

  &__group-info {
    padding-right: 10px;
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

  &__item-odd {
    padding-right: 10px;
  }

  &__item-even {
    padding-left: 10px;
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


