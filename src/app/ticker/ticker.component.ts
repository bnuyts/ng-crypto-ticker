import { Component, Input, OnInit } from '@angular/core';
import { Ticker } from './ticker.model';

@Component({
  selector: '[app-ticker]',
  templateUrl: './ticker.component.html',
  styleUrls: ['./ticker.component.scss'],
})
export class TickerComponent implements OnInit {
  @Input()
  public ticker: Ticker | null;

  constructor() {
    this.ticker = null;
  }

  ngOnInit(): void {}
}
