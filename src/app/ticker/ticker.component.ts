import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Ticker } from './ticker.model';

@Component({
  selector: 'app-ticker',
  templateUrl: './ticker.component.html',
  styleUrls: ['./ticker.component.scss'],
})
export class TickerComponent implements OnInit, OnChanges {
  @Input()
  public ticker: Ticker | null;

  public diff = 0;

  constructor() {
    this.ticker = null;
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.ticker.previousValue) {
      const diff =
        changes.ticker.currentValue.price - changes.ticker.previousValue.price;
      if (diff != changes.ticker.currentValue.price) {
        this.diff = diff;
      }
    }
  }
}
