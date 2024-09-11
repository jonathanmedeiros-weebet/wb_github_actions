<template>
  <div class="calendar">
    <div class="calendar__header">
      <button class="calendar__actions" @click="prevMonth">
        <IconArrowLeft :size="28" color="#0be58e"/>
      </button>
      {{ currentMonthAndYear }}
      <button class="calendar__actions" @click="nextMonth">
        <IconArrowRight :size="28" color="#0be58e"/>
      </button>
    </div>
    <div class="calendar__body">
      <div class="calendar__week-days">
        <span>dom</span>
        <span>seg</span>
        <span>ter</span>
        <span>qua</span>
        <span>qui</span>
        <span>sex</span>
        <span>sáb</span>
      </div>
      <div class="calendar__weeks">
        <div
          class="calendar__week"
          v-for='(week, index) in calendar'
          :key="index"
        >
          <div
            class="calendar__day"
            v-for="(day, indexDay) in week"
            :class="{'calendar__day--selected': day == daySelected && isMonthSelected}"
            :key="`${indexDay}-${index}`"
            @click="handleClick(day)"
          >
            {{ day }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import {
  dateFormatInMonthAndYear,
  now,
  convertInMomentInstance
} from '@/utilities'
import IconArrowLeft from './icons/IconArrowLeft.vue'
import IconArrowRight from './icons/IconArrowRight.vue'

export default {
  components: { IconArrowLeft, IconArrowRight },
  name: 'calendar',
  props: {
    initialDate: {
      type: [String, Object],
      default: () => now()
    }
  },
  data() {
    return {
      calendar: [],
      today: convertInMomentInstance(this.initialDate),
      currentMonthAndYear: dateFormatInMonthAndYear(this.initialDate),
      dateSelected: convertInMomentInstance(this.initialDate),
      monthPreview: ''
    }
  },
  created() {
    this.mountCalendar()
    this.monthPreview = this.today.format('MM')
  },
  computed: {
    daySelected() {
      return this.dateSelected.format('DD')
    },
    isMonthSelected() {
      return dateFormatInMonthAndYear(this.dateSelected) === this.currentMonthAndYear
    }
  },
  methods: {
    nextMonth() {
      this.today.add(1,'month')
      this.currentMonthAndYear = dateFormatInMonthAndYear(this.today)
      this.mountCalendar()
    },
    prevMonth() {
      this.today.subtract(1, 'month')
      this.currentMonthAndYear = dateFormatInMonthAndYear(this.today)
      this.mountCalendar()
    },
    mountCalendar() {
      const startMonthDay = this.today.clone().startOf('month')
      const endMonthDay = this.today.clone().endOf('month')

      const startMonthDate = startMonthDay.date()
      const endMonthDate = endMonthDay.date()

      const calendar = []
      let date = startMonthDay
      let week = ['', '', '', '', '', '', '']

      for (let dateNumber = startMonthDate; dateNumber <= endMonthDate; dateNumber++) {
        const weekdays = {'sun': 0, 'mon': 1, 'tue': 2, 'wed': 3, 'thu': 4, 'fri': 5, 'sat': 6}
        const weekday = date.format('ddd').toLowerCase();
        const weekIndex = weekdays[weekday];
        
        week[weekIndex] = dateNumber;

        if(weekday === 'sat' || dateNumber === endMonthDate) {
          calendar.push(week)
          week = ['', '', '', '', '', '', '']
        }
        date.add(1, 'day');
      }

      this.calendar = calendar;
    },
    handleClick(day) {
      if(!Boolean(day)) return;
      const dateCustom = convertInMomentInstance(this.today);
      dateCustom.date(day);

      this.dateSelected = null;
      this.dateSelected = dateCustom;
      this.$emit('change', dateCustom)
    }
  },
}
</script>

<style lang="scss" scoped>
.calendar {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    font-size: 16px;
    font-weight: 500;
    padding: 10px;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  &__actions,
  &__actions:hover {
    background: transparent;
    border: none
  }

  &__week-days {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 10px 24px;

    color: var(--color-text);
    background: var(--background);
  }

  &__weeks {
    padding: 0 24px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__week {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__day {
    width: 36px;
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;

    font-size: 14px;
    font-weight: 500;

    &--selected {
      background: var(--highlight);
      color: var(--inputs-odds);
      border-radius: 50px;
    }
  }
}
</style>
  