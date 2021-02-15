import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, timer } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { Ticker } from './ticker/ticker.model';

const imageUrl =
  'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579';
const name = 'Bitcoin';
const symbol = 'BTC';

@Injectable({
  providedIn: 'root',
})
export class TickerStoreService {
  private _tickerData = new BehaviorSubject<Ticker>({
    imageUrl,
    name,
    price: 0,
    symbol,
  });

  public tickerData = this._tickerData.asObservable();

  constructor(private _httpClient: HttpClient) {
    timer(0, 30 * 1000)
      .pipe(
        mergeMap(() =>
          this._httpClient.get<{ bitcoin: { eur: number } }>(
            'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur'
          )
        ),
        map((result) =>
          this._tickerData.next({
            imageUrl,
            name,
            symbol,
            price: result.bitcoin.eur,
          })
        )
      )
      .subscribe();
  }

  public updateTickerData(ticker: Ticker) {
    this._tickerData.next(ticker);
  }
}
