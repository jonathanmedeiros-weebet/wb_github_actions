<template>
  <div class="modal-overlay" @click.self="handleBackdropClick">
    <div ref="modal" class="modal">
      <div class="modal_icons">
        <div class="modal__element"></div>
      </div>
      <div class="modal__header" v-if="$slots['title']">
        <slot name="title"></slot>
      </div>
      <div class="modal__body" v-if="$slots['body']">
        <slot name="body"></slot>
      </div>
      <div class="modal__footer" v-if="$slots['footer']">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>
  
<script>
import IconClose from "@/components/icons/IconClose.vue";

export default {
  name: 'w-modal',
  components: { 
    IconClose 
  },
  props: {
    backdropClick: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      touchStartPageY: 0,
      modalHeightLimit: 0,
      modalHeight: 0
    }
  },
  mounted() {
    document.body.style.overflow = 'hidden'

    const modalRef = this.$refs['modal'];
    modalRef.addEventListener('touchstart', (e) => {
      this.touchStartPageY = e.changedTouches[0].pageY;
      this.modalHeight = e.target.clientHeight;
      this.modalHeightLimit = this.modalHeight - 50;
    });

    modalRef.addEventListener('touchmove', (e) => {
      const touchMovePageY = e.changedTouches[0].pageY;

      const modalMoveY = touchMovePageY - this.touchStartPageY;
      modalRef.style.marginBottom = `-${modalMoveY.toFixed(2)}px`;

      const modalHeightObserver = this.modalHeightLimit - (touchMovePageY - this.touchStartPageY);
      if(modalHeightObserver <= 0) {
        this.handleClose();
      }
    });

    modalRef.addEventListener('touchend', (e) => {
      modalRef.style.marginBottom = 0;
    });
  },
  methods: {
    handleBackdropClick() {
      if(!this.backdropClick) return;
      this.handleClose();
    },
    handleClose() {
      document.body.style.overflow = 'initial'
      this.$emit('close');
    }
  }
};
</script>

<style lang="scss" scoped>

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 3;
  overflow: hidden;
  transition: transform 0.5s ease-out;
}
  
.modal {
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: var(--color-background-input);
  border-radius: 24px 24px 0px 0px;
  width: 100%;
  height: auto;
  max-height: 90%;
  
  overflow-y: auto;

  &_icons {
    display: flex;
    flex-direction: column;
  }
  
  &__element {
    margin-left: auto;
    margin-right: auto;
    margin-top: 18px;
    background-color: var(--color-background);
    width: 49px;
    height: 5px;
    gap: 10px;
    border-radius: 10px;
  }

  &__btnclose {
    display: flex;
    align-items: center;  /* Centraliza verticalmente */
    justify-content: center; 
    background-color: var(--color-background-input);
    color: var(--color-text-input);
    border: none;
    font-size: 15px;
    margin-left: auto;
    margin-bottom: -10px;
    padding-top: 7px; 
    padding-right: 20px; 
  }

  &__header {
    display: flex;
    gap: 20px;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  &__footer {
      text-align: center;
  }

  &__body {
    text-align: center;
    overflow-y: auto;
    max-height: calc(90% - 60px);
  }
}

</style>
  