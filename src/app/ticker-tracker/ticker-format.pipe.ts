import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tickerFormat',
})
export class TickerFormatPipe implements PipeTransform {
  transform(value: string): string {
    const [ticker] = value.split('@');
    return ticker.toLocaleUpperCase();
  }
}
