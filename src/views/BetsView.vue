<template>
  <div class="bets">
    <Header title="Apostas" :showBackButton="true" />
    <div class="bets__container">
      <w-input
        label="Apostador"
        name="punter"
        placeholder="999.999.999-99"
        type="text"
      />

      <w-input
        label="Apostador"
        name="code"
        placeholder="999.999.999-99"
        type="text"
      />

      <w-input
        label="Data"
        name="date"
        placeholder="dd/mm/aaaa"
        type="date"
      />

      <w-button
        id="btn-filter"
        text="Filtar"
        value="filter"
        name="btn-filter"
        @click="getFilters"
      />

      <div class="bets__results" v-if="isFiltersVisible">
        <p class="bets__filters">{{ bets.length }} apostas encontradas</p>
  
        <div class="bets__button-filters">
          <button>Todas</button>
          <button>Pendentes</button>
          <button>Ganhou</button>
          <button>Perdeu</button>
        </div>
  
        <div class="bets__content-filters" v-for="(bet, index) in bets" :key="index">
          <card-bets>
            <template #title>
              <p>Código da Aposta: {{ bet.code }}</p>
            </template>
            <template #subtitle>
              <p>HORÁRIO: 02/06/2024 18:00</p>
            </template>
            <template #body>
              <p>Apostador: {{ bet.client }}</p>
              <table class="table">
                <tbody>
                  <tr class="table__line">
                    <td class="table__column table_column--left">Valor apostado:</td>
                    <td class="table__column table_column--right">R$ {{ bet.value }}</td>
                  </tr>
                  <tr>
                    <td class="left-align">Comissão:</td>
                    <td class="right-align">R$ {{ bet.comission }}</td>
                  </tr>
                  <tr>
                    <td class="left-align">Prêmio:</td>
                    <td class="right-align">R$ {{ bet.premio }}</td>
                  </tr>
                  <tr>
                    <td class="left-align">Status:</td>
                    <td 
                      class="right-align"
                      :class="{ 'table__status--win text-win': bet.status === 'Ganhou', 'table__status--lose': bet.status === 'Perdeu' }"
                    >{{ bet.status }}</td>
                  </tr>
                  <tr>
                    <td class="left-align">Pagamento:</td>
                    <td class="right-align">{{ bet.payment }}</td>
                  </tr>
                </tbody>  
              </table>
            </template>
  
            <template #footer >
              <div :class="{
                'bets__card__footer--inline': bet.status === 'Pendente',
                'bets__card__footer':  bet.status !== 'Pendente'
              }">
                <w-button
                  id="btn-view"
                  text="Visuaizar"
                  value="view"
                  name="btn-view"
                  color="secondary"
                  class="bets_btn"
                  v-if="bet.status != 'Pendente'"
                />

                <w-button
                  id="btn-payer"
                  text="Pagar"
                  value="payer"
                  name="btn-payer"
                  color="secondary"
                  class="bets_btn"
                  @click="pagar"
                    v-if="bet.status === 'Pendente'"
                />

                <w-button
                  id="btn-finish"
                  text="Encerrar aposta"
                  value="finish"
                  name="finish"
                  color="secondary"
                  class="bets_btn"
                  v-if="bet.status === 'Pendente'"
                />
              </div>
            </template>
          </card-bets>
        </div>
      </div>

      <WModal v-if="isModalVisible" @close="closeModal">

        <template #body>    
                
          <w-button
            id="btn-yes"
            text="Sim"
            value="yes"
            name="btn-yes"
            color="primary"
          />
          <div class="bets__separator"></div>

          <w-button
            id="btn-no"
            text="Não"
            value="no"
            name="btn-no"
            color="secondary"
          />

          <div class="bets__separator"></div>
        </template>
        
        
      
      </WModal>

    </div>
  </div>
</template>

<script>
import Header from '@/components/layouts/Header.vue'
import WInput from '@/components/Input.vue'
import WButton from '@/components/Button.vue'
import WModal from '@/components/Modal.vue'
import CardBets from '@/components/CardBets.vue'

export default {
  name: 'bets',
  components: { 
    Header,
    WInput,
    WButton,
    WModal,
    CardBets
  },
  data() {
    return {
      isModalVisible: false,
      isFiltersVisible: false,
      bets: [
        {
          code: 'AEC0-1AB4',
          client: '999.999.999-99',
          value: 100,
          comission: 0,
          premio: 0,
          status: 'Perdeu',
          payment:  '-'

        },
        {
          code: 'XAB3-5BU1',
          client: '999.999.999-99',
          value: 200,
          comission: 0,
          premio: 0,
          status: 'Ganhou',
          payment:  '-'

        },
        {
          code: 'CCB0-1A39',
          client: '999.999.999-99',
          value: 50,
          comission: 10,
          premio: 1,
          status: 'Pendente',
          payment:  '-'

        }
      ]
    }
  },
  methods: {
    pagar(){
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
    getFilters() {
      this.isFiltersVisible = !this.isFiltersVisible;
    },
    getButtonClass(status) {
      switch(status) {
        case 'Pendente':
          return 'bets__card__footer--inline'
        default:
          return 'bets__card__footer'
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.bets {
  height: 100vh;
  justify-content: space-between;

  &__container {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100vh;
    padding: 30px 30px 0px 30px;
    
  }

  &__filters {
    padding-top: 30px;
    color: var(--color-text-input);
  }

  &__buttons__filters {
    display: flex;
    flex-direction: row;
    padding-top: 20px;
  }

  &_content_filters {
    margin-top: 20px;
  }

  &__table {
    padding: 0;
    margin: 0;
    width: 100%;
  }

  tr {
    padding: 0;
    margin: 0;
  }

  &__separator {
    margin-bottom: 20px;
  }

  
  &__card__footer {
    display: flex;
    flex-direction: column;
    gap: 10px;

    &--inline {
      display: flex;
      flex-direction: row;
      justify-content: center;
      gap: 10px;
    }
    
  }

  


  
}

.left-align {
  text-align: left;
}

.right-align {
  text-align: right;
}

.text-win {
  color: var(--color-text-win);
}
.text-lose {
  color: var(--color-text-lose);
}

</style>