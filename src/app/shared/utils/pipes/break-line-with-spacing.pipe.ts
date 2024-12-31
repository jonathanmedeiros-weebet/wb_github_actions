import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'breakLineWithSpacing'
})
export class BreakLineWithSpacingPipe implements PipeTransform {
    transform(value: string): string {
        if (!value) return value;
        return value.split(' ').join('<br>');
      }
}
