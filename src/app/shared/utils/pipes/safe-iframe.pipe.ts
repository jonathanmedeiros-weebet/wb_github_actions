import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'safeIframe'
})
export class SafeIframePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
