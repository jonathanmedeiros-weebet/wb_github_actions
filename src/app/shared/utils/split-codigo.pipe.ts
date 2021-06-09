import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'splitCodigo'
})
export class SplitCodigoPipe implements PipeTransform {

  transform(codigo: any): string {
    return codigo.substr(0, 4) + '-' + codigo.substr(4, 4);
  }

}
