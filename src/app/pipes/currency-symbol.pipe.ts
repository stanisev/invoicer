import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencySymbol',
  standalone: true
})
export class CurrencySymbolPipe implements PipeTransform {

  transform(value: string): string {
    if (value === 'BGN') {
      return 'лв.';
    }
    return value;
  }

}
