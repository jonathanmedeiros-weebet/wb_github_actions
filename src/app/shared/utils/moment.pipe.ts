import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'moment'
})
export class MomentPipe implements PipeTransform {
  transform(value: any, format?: any): any {
    let result: string = null;

    if (value) {
      result = moment(value).format(format);
    }

    return result;
  }
}
