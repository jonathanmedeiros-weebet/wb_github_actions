<template>
    <header class="header"> 
        <button
            class="header__back-button"
            v-if="showBackButton"
            @click="handleBackButtonClick"
        >
            <IconArrowLeft :size="24"/>
        </button>
        <slot></slot>
        <span class="header__title" v-if="title"> {{ title }}</span>
        <div class="header__action-buttons">
            <button
                class="header__action-button"
                v-if="showCalendarButton"
                @click="handleCalendarButtonClick"
            >
                <IconCalendar :size="24" />
            </button>

            <button
                class="header__action-button"
                v-if="showSearchButton"
                @click="handleSearchButtonClick"
            >
                <IconSearch :size="24" />
            </button>
        </div>
   </header>
</template>

<script>
import IconArrowLeft from '../icons/IconArrowLeft.vue'
import IconCalendar from '../icons/IconCalendar.vue'
import IconSearch from '../icons/IconSearch.vue'

export default {
  components: { IconArrowLeft, IconCalendar, IconSearch },
  name: 'w-header',
  props: {
    showBackButton: {
        type: Boolean,
        default: false
    },
    showCalendarButton: {
        type: Boolean,
        default: false
    },
    showSearchButton: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: ''
    },
  },
  methods: {
    handleBackButtonClick() {
        this.$router.back();
    },
    handleCalendarButtonClick() {
        this.$emit('calendarClick');
    },
    handleSearchButtonClick() {
        this.$emit('searchClick');
    },
  }
}
</script>

<style lang="scss" scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;

    width: 100%;
    height: 58px;
    min-height: 58px;

    background: var(--color-background);
    border-bottom: 1px solid #FFFFFF1A;
    color: var(--color-text);

    &__back-button,
    &__back-button:hover {
        display: flex;
        justify-content: center;
        align-items: center;

        margin: 0;
        padding: 0;
        border: none;
        background: transparent;
        height: 30px;
        width: 30px;
    }

    &__title {
        font-size: 20px;
        font-weight: 400;
        line-height: 23.44px;
        color: var(--color-text);
    }

    &__action-buttons {
        display: flex;
        gap: 24px;
        align-items: center;
        justify-content: flex-end;
    }

    &__action-button {
        margin: 0;
        padding: 0;
        border: none;
        background: transparent;
    }
}
</style>