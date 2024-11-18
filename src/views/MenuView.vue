<template>
  <div class="menu">
    <section class="menu__container">
      <div class="user-info">
        <img class="user-info__icon" src="../assets/images/user-line.png" alt="User Icon">
        <div class="user-info__welcome">
          <span class="user-info__greeting">Olá,</span>
          <span class="user-info__name">{{ userName }}</span>
        </div>
      </div>
      <div class="wallet">
        <div class="wallet__item">
          <p class="wallet__label">Crédito</p>
          <span class="wallet__value">
            R$ {{ isCreditoVisible ? '*******' : credit }}
            <IconEye v-if="!isCreditoVisible" :color="'var(--foreground-inputs-odds)'" class="wallet__eye" @click.native="toggleCreditoVisibility" />
            <IconEyeClose v-else class="wallet__eye" :color="'var(--foreground-inputs-odds)'" @click.native="toggleCreditoVisibility" />
          </span>
        </div>
        <div class="wallet__item">
          <p class="wallet__label">Saldo</p>
          <span class="wallet__value">
            R$ {{  isSaldoVisible ? '*******' : balance }}
            <IconEye v-if="!isSaldoVisible" class="wallet__eye" :color="'var(--foreground-inputs-odds)'" @click.native="toggleSaldoVisibility" />
            <IconEyeClose v-else class="wallet__eye" :color="'var(--foreground-inputs-odds)'" @click.native="toggleSaldoVisibility" />
          </span>
        </div>
        <div class="wallet__shortcuts">
          <button class="wallet__button" @click="handleNavigate('/dashboard')">
            <IconInsertChart class="wallet__icon"/>
            Dashboard
          </button>
          <button class="wallet__button" @click="handleOpenConsultTicketModal">
            <IconManageSearch class="wallet__icon" />
            Consultar Bilhete
          </button>
          <button @click="handleNavigate('/reckoning')" class="wallet__button">
            <IconFactCheck class="wallet__icon" />
            Apuração
          </button>
        </div>
      </div>
      <div class="more-options">
        <span class="more-options__text">Mais opções</span>
        <div class="more-options__card">
          <button class="more-options__item" @click="handleNavigate('/movements')">
            <IconMoney class="more-options__icon" />
            <span class="more-options__text-icon">Movimentações</span>
          </button>
          <button class="more-options__item" @click="handleNavigate('/change-password')">
            <IconPassKey class="more-options__icon" />
            <span class="more-options__text-icon">Alterar senha</span>
          </button>
          <button class="more-options__item" @click="handlePrinterSetting">
            <IconSettings class="more-options__icon" />
            <span class="more-options__text-icon">Configurações</span>
          </button>
          <button class="more-options__item" @click="handleNavigate('/results')">
            <IconFactCheck class="more-options__icon" />
            <span class="more-options__text-icon">Resultados</span>
          </button>
          <button class="more-options__item" @click="handleLogout">
            <IconLogout class="more-options__icon" />
            <span class="more-options__text-icon">Sair</span>
          </button>
        </div>
      </div> 
    </section>
    <ModalConsultTicket
      ref="modalConsultTicket"
      v-if="isConsultTicketModalVisible" 
      @close="handleCloseConsultTicketModal" 
      @consult="handleConsultTicket"
    />
  </div>
</template>

<script>
import IconEye from '@/components/icons/IconEye.vue';
import IconEyeClose from '@/components/icons/IconEyeClose.vue';
import IconMoney from '@/components/icons/IconMoney.vue';
import IconSettings from '@/components/icons/IconSettings.vue';
import IconLogout from '@/components/icons/IconLogout.vue';
import IconPassKey from '@/components/icons/IconPassKey.vue';
import IconFactCheck from '@/components/icons/IconFactCheck.vue';
import IconManageSearch from '@/components/icons/IconManageSearch.vue';
import IconInsertChart from '@/components/icons/IconInsertChart.vue';
import ModalConsultTicket from './TicketsView/parts/ModalConsultTicket.vue';
import { logout, getBetByCode, getFinancial } from '@/services';
import { formatCurrency, wbPostMessage } from '@/utilities';
import { localStorageService } from "@/services";
import Toast from '@/components/Toast.vue';
import { ToastType } from '@/enums';
import { useToastStore } from '@/stores';

export default {
  name: 'userMenu',
  components: {
    IconEye,
    IconEyeClose,
    IconMoney,
    IconSettings,
    IconLogout,
    IconPassKey,
    IconFactCheck,
    IconManageSearch,
    IconInsertChart,
    ModalConsultTicket,
    Toast
  },
  data() {
    return {
      code: null,
      balanceData: null,
      isCreditoVisible: false,
      isSaldoVisible: false,
      isConsultTicketModalVisible: false,
      toastStore: useToastStore()
    };
  },
  mounted() {
    this.getData();
  },
  computed: {
    balance() {
      return formatCurrency(Number(this.balanceData?.saldo ?? 0));
    },
    credit() {
      return formatCurrency(Number(this.balanceData?.credito ?? 0));
    },
    userName() {
      const user = localStorageService.get('user');
      return user ? user.nome : '';
    }
  },
  methods: {
    handleLogout() {
      logout();
      this.$router.replace('/');
    },
    handleNavigate(route) {
      this.$router.push(route);
    },
    toggleCreditoVisibility() {
      this.isCreditoVisible = !this.isCreditoVisible;
    },
    toggleSaldoVisibility() {
      this.isSaldoVisible = !this.isSaldoVisible;
    },
    handleOpenConsultTicketModal() {
      this.isConsultTicketModalVisible = true;
    },
    handleCloseConsultTicketModal() {
      this.isConsultTicketModalVisible = false;
    },
    handlePrinterSetting() {
      wbPostMessage('listPrinters')
    },
    async getData() {
      try {
        const res = await getFinancial();
        this.balanceData = res;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    async handleConsultTicket(ticketCode) {
      try {
        const resp = await getBetByCode(ticketCode);
        if(resp.results){
          this.$router.push({ 
            name: 'close-bet',
            params: {
              id: resp.results.id,
              action: 'view'
            }
          });
        }
      } catch (error) {
        this.toastStore.setToastConfig({
          message: error.errors.message,
          type: ToastType.DANGER,
          duration: 5000
        });
        this.handleCloseConsultTicketModal();
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.menu {
  color: #ffffff;
  color: var(--foreground-game);
  height: auto;
  width: 100%;
  padding-bottom: 100px;

  &__container {
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0 20px;
    padding-top: 70px;
  }
}

.user-info {
  display: flex;
  align-items: center;

  &__icon {
    width: 40px;
    height: 40px;
    border-radius: 20px;
  }

  &__welcome {
    display: flex;
    flex-direction: column;
    margin-top: -10px;
    margin-left: 10px;
  }

  &__name {
    font-size: 24px;
    font-weight: 500;
    line-height: 24px;
    color: #ffffff80;
    color: var(--foreground-header);
  }

  &__greeting {
    font-size: 16px;
    font-weight: 400;
    line-height: 16px;
    color: #ffffff80;
    color: var(--foreground-header);  
  }
}

.wallet {
  width: 100%;
  height: auto;
  margin-top: 18px;
  background-color: #181818;
  background-color: var(--game);
  border-radius: 10px;
  padding: 22px 18px;
  padding-top: 16px;

  &__item {
    padding-bottom: 14px;
  }

  &__label {
    display: flex;
    color: #ffffff;
    color: var(--foreground-game);
    opacity: 0.5;
    font-size: 13px; 
  }

  &__value {
    display: flex;
    align-items: center;
    color: #ffffff;
    color: var(--foreground-league);
    font-size: 20px; 
  }

  &__eye {
    margin-left: 15px;
    cursor: pointer;
    color: #ffffff80;
    color: var(--foreground-league);
    opacity: 0.5;
  }

  &__shortcuts {
    display: flex;
    justify-content: space-between;
  }

  &__button {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ffffff;
    background-color: var(--background);
    border: none;
    border-radius: 18px;
    color: #0a0a0a;
    color: var(--foreground-header); 
    padding: 7px;
    white-space: nowrap;
    font-size: 10px;
    margin-right: 10px;
  }

  &__icon {
    fill: #181818;
    fill: var(--foreground-game);
    align-items: center;
  }
}

.more-options {
  display: flex;
  flex-direction: column;

  &__text {
    color: #ffffff;
    color: var(--foreground-header);
    font-size: 16px;
    padding-bottom: 10px;
  }

  &__card {
    width: 100%;
    background-color: #181818;
    background-color: var(--game);
    padding: 18px 8px;
    padding-top: 8px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
  }

  &__item {
    display: flex;
    align-items: center;
    background: none;
    border: none;
    color: inherit;
    padding-top: 10px;
    font-size: 14px;
  }

  &__icon { 
    fill: #181818;
    fill: var(--foreground-game);
    align-items: center;
  }

  &__text-icon {
    margin-left: 10px;
  }
}
</style>
