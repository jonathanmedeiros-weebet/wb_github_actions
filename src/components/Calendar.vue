<template>
  <div class="calendar">
    <div class="calendar__header">
      <button class="calendar__actions" @click="prevMonth">
        <IconArrowLeft :size="28" :color="useHexColors"/>
      </button>
      {{ currentMonthAndYear }}
      <button class="calendar__actions" @click="nextMonth">
        <IconArrowRight :size="28" :color="useHexColors"/>
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
          <button
            class="calendar__day"
            v-for="({day, disabled}, indexDay) in week"
            :class="{'calendar__day--selected': day == daySelected && isMonthSelected}"
            :key="`${indexDay}-${index}`"
            :disabled="disabled"
            @click="handleClick(day)"
          >
            {{ day }}
        </button>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import {
  dateFormatInMonthAndYear,
  now,
  convertInMomentInstance,
  isAndroid5
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
    },
    maxDate: {
      type: [String, null, Object],
      default: null
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
    },
    useHexColors() {
      return isAndroid5() ? '#ffffff' : 'var(--foreground-header)';
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

      const maxDate = this.maxDate ? convertInMomentInstance(this.maxDate) : null;

      const calendar = []
      let date = startMonthDay
      let week = ['', '', '', '', '', '', '']

      for (let dateNumber = startMonthDate; dateNumber <= endMonthDate; dateNumber++) {
        const weekdays = {'sun': 0, 'mon': 1, 'tue': 2, 'wed': 3, 'thu': 4, 'fri': 5, 'sat': 6}
        const weekday = date.format('ddd').toLowerCase();
        const weekIndex = weekdays[weekday];
        
        console.log(maxDate.format('YYYY-MM-DD'))
        console.log(date.format('YYYY-MM-DD'))
        const disabled = maxDate && maxDate.format('YYYY-MM-DD') < date.format('YYYY-MM-DD') ? true : false; 
        week[weekIndex] = { day: dateNumber, disabled };

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
    color: #ffffff;
    color: var(--foreground-header);
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
    color: #ffffff;
    color: var(--foreground);
    background: #181818;
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
    color: #ffffff;
    color: var(--foreground-header);
    background: transparent;
    border: 0;

    &:disabled {
      opacity: .3;
    }

    &--selected {
      background: #35cd96;
      background: var(--highlight);
      color: #181818;
      color: var(--foreground-highlight);
      border-radius: 50px;
    }
  }
}
</style>
  