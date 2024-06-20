import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizeFirstLetter',
})
export class CapitalizeFirstLetterPipe implements PipeTransform {
  transform(value: any): string {
    if (typeof value !== 'string') {
      return value;
    }

    return value[0].toUpperCase() + value.substring(1);
  }
}
