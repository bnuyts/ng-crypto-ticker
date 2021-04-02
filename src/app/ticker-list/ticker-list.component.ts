import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, last, map } from 'rxjs/operators';
import { TickerStoreService } from '../services/ticker-store.service';
import { Ticker } from '../ticker/ticker.model';

@Component({
  selector: 'app-ticker-list',
  templateUrl: './ticker-list.component.html',
  styleUrls: ['./ticker-list.component.scss'],
})
export class TickerListComponent implements OnInit {
  public tickers$?: Observable<Ticker[]>;
  public lastUpdateEpoch$?: Observable<Date>;

  constructor(private _tickerStore: TickerStoreService) {}

  ngOnInit(): void {
    this.tickers$ = this._tickerStore.tickers$;
    this.lastUpdateEpoch$ = this._tickerStore.lastUpdateEpoch$.pipe(
      map((epoch) => new Date(epoch))
    );
  }
}
