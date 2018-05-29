import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'timeToString'
})
export class TimeToStringtPipe implements PipeTransform {
  transform(value: any): any {
    if (!value) {
      return value;
    }

    let result: string;
    let time: Array<string> = value.split(':');
    let hours: string = time[0];
    let minutes: string = time[1];

    if (parseInt(hours)) {
      result = `${time[0]} horas e ${time[1]} minutos`;
    } else {
      result = `${time[1]} minutos`;
    }

    return result;
  }
}
