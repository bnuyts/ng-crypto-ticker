import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, pairwise } from 'rxjs/operators';
import { Ticker } from './ticker.model';

@Component({
  selector: '[app-ticker]',
  templateUrl: './ticker.component.html',
  styleUrls: ['./ticker.component.scss'],
})
export class TickerComponent implements OnInit {
  @Input()
  public ticker: Ticker | null;

  public change$?: Observable<boolean>;

  constructor() {
    this.ticker = null;
  }

  ngOnInit(): void {
    this.change$ = this.ticker?.price$.pipe(
      pairwise(),
      map((pairValue: [number, number]) => pairValue[0] < pairValue[1])
    );
  }
}
