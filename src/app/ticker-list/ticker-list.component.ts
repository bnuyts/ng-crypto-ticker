import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TickerStoreService } from '../ticker-store.service';
import { Ticker } from '../ticker/ticker.model';

@Component({
  selector: 'app-ticker-list',
  templateUrl: './ticker-list.component.html',
  styleUrls: ['./ticker-list.component.scss'],
})
export class TickerListComponent implements OnInit {
  public ticker$?: Observable<Ticker>;

  constructor(private _tickerStore: TickerStoreService) {
    this.ticker$ = this._tickerStore.tickerData;
  }

  ngOnInit(): void {}
}
