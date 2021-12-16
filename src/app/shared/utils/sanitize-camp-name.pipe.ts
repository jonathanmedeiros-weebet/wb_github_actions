import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sanitizeCampName'
})
export class SanitizeCampNamePipe implements PipeTransform {

  transform(name: any): string {
    return name.substring(name.indexOf(':') + 1);
  }

}
