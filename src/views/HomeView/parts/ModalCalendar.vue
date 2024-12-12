<template>
    <WModal ref="wmodal" :backdropClick="true" @close="handleClose">
      <template #body>
        <template v-if="!isMultiDate">
          <Calendar
            class="calendar"
            :maxDate="maxDate"
            @change="handleCalendarChange"
            :initialDate="initialDate"
          />
        </template>

        <template v-else>
          <CalendarWithMultipleDates
            class="calendar"
            @change="handleCalendarChange"
            :initialDate="initialDate"
            :finalDate="finalDate"
          />
        </template>
        
      </template>
    </WModal>
</template>

<script>
import WModal from '@/components/Modal.vue'
import Calendar from '@/components/Calendar.vue'
import { now } from '@/utilities'
import CalendarWithMultipleDates from '@/components/CalendarWithMultipleDates.vue'

export default {
    name: 'modal-calendar',
    components: { WModal, Calendar, CalendarWithMultipleDates },
    props: {
      initialDate: {
        type: [String, Object],
        default: () => now()
      },
      finalDate: {
        type: [String, Object],
        default: () => now()
      },
      isMultiDate: {
        type: Boolean,
        default: false
      },
      maxDate: {
        type: [String, null, Object],
        default: null
      }
    },
    methods: {
      handleCalendarChange(date) {
        this.$refs['wmodal'].handleClose();
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