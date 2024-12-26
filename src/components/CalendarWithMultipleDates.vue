<template>
  <div class="calendar">
    <div class="calendar__header">
      <button class="calendar__actions" @click="prevMonth">
        <IconArrowLeft :size="28" :color="useHexColors"/>
      </button>
      {{ initialMonthAndYear }}
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
          <div
            class="calendar__day"
            v-for="(day, indexDay) in week"
            :class="{ 'calendar__day--selected': verifyIfWasSelected(day)}"
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
  convertInMomentInstance,
  isAndroid5
} from '@/utilities'
import IconArrowLeft from './icons/IconArrowLeft.vue'
import IconArrowRight from './icons/IconArrowRight.vue'

export default {
  components: { IconArrowLeft, IconArrowRight },
  name: 'calendar-with-multi-dates',
  props: {
    initialDate: {
      type: [String, Object],
      default: () => now()
    },
    finalDate: {
      type: [String, Object],
      default: () => now()
    },
  },
  data() {
    return {
      calendar: [],
      today: convertInMomentInstance(this.initialDate),
      initialMonthAndYear: dateFormatInMonthAndYear(this.initialDate),
      initialDateSelected: convertInMomentInstance(this.initialDate),
      finalMonthAndYear: dateFormatInMonthAndYear(this.finalDate),
      finalDateSelected: convertInMomentInstance(this.finalDate),
      monthPreview: ''
    }
  },
  created() {
    this.mountCalendar()
    this.monthPreview = this.today.format('MM')
  },
  computed: {
    initialDaySelected() {
      return this.initialDateSelected ? this.initialDateSelected.format('DD') : ''
    },
    finalDaySelected() {
      return this.finalDateSelected ? this.finalDateSelected.format('DD') : ''
    },
    isInitialMonthSelected() {
      return dateFormatInMonthAndYear(this.initialDateSelected) === this.initialMonthAndYear
    },
    isFinalMonthSelected() {
      return dateFormatInMonthAndYear(this.finalDateSelected) === this.finalMonthAndYear
    },
    useHexColors() {
      return isAndroid5() ? '#35cd96' : 'var(--highlight)';
    }
  },
  methods: {
    verifyIfWasSelected(day) {
      return (day == this.initialDaySelected && this.isInitialMonthSelected) || (day == this.finalDaySelected && this.isFinalMonthSelected);
    },
    nextMonth() {
      this.today.add(1,'month')
      this.initialMonthAndYear = dateFormatInMonthAndYear(this.today)
      this.finalMonthAndYear = dateFormatInMonthAndYear(this.today)
      this.mountCalendar()
    },
    prevMonth() {
      this.today.subtract(1, 'month')
      this.initialMonthAndYear = dateFormatInMonthAndYear(this.today)
      this.finalMonthAndYear = dateFormatInMonthAndYear(this.today)
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

      if(this.initialDateSelected && this.finalDateSelected) {
        this.initialDateSelected = dateCustom;
        this.finalDateSelected = null;
      } else if(!this.initialDateSelected) {
        this.initialDateSelected = dateCustom;
      } else if(!this.finalDateSelected) {
        if(dateCustom < this.initialDateSelected) return;
        this.finalDateSelected = dateCustom;
      }

      if(this.initialDateSelected && this.finalDateSelected) {
        this.$emit('change', {
          initialDate: this.initialDateSelected,
          finalDate: this.finalDateSelected,
        })
      }
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
    color: #35cd96;
    color: var(--foreground-header);

    &--selected {
      background: #35cd96;
      background: var(--highlight);
      color: #ffffff;
      color: var(--foreground-highlight);
      border-radius: 50px;
    }
  }
}
</style>
  