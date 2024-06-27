<template>
    <WModal :backdropClick="true">
      <template #body>
        <Calendar class="calendar" @change="handleCalendarChange"/>
      </template>
    </WModal>
</template>

<script>
import WModal from '@/components/Modal.vue'
import Calendar from '@/components/Calendar.vue'
import { now } from '@/utilities/date.utitlity'

export default {
    name: 'modal-calendar',
    components: { WModal, Calendar },
    props: {
      initialDate: {
        type: String,
        default: now()
      }
    },
    methods: {
      handleCalendarChange(date) {
        this.$emit('change', date)
      }
    }
}
</script>

<style lang="scss" scoped>
.calendar {
  padding-bottom: 30px;
}
</style>