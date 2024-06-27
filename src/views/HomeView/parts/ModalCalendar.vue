<template>
    <WModal :backdropClick="true" @close="handleClose">
      <template #body>
        <Calendar
          class="calendar"
          @change="handleCalendarChange"
          :initialDate="initialDate"
        />
      </template>
    </WModal>
</template>

<script>
import WModal from '@/components/Modal.vue'
import Calendar from '@/components/Calendar.vue'
import { now } from '@/utilities/date.utitlity.ts'

export default {
    name: 'modal-calendar',
    components: { WModal, Calendar },
    props: {
      initialDate: {
        type: [String, Object],
        default: () => now()
      }
    },
    methods: {
      handleCalendarChange(date) {
        this.$emit('change', date)
      },
      handleClose() {
        this.$emit('closeModal')
      }
    }
}
</script>

<style lang="scss" scoped>
.calendar {
  padding-bottom: 30px;
}
</style>