import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, pairwise, tap } from 'rxjs/operators';
import { SMA, RSI } from 'trading-signals';
import { Ticker, TickerState } from './ticker.model';

@Component({
  selector: '[app-ticker]',
  templateUrl: './ticker.component.html',
  styleUrls: ['./ticker.component.scss'],
})
export class TickerComponent implements OnInit {
  @Input()
  public ticker: Ticker | null;

  // SMA 5-13 cross
  private _sma5: SMA;
  private _sma13: SMA;
  private _smaCrossSubject$ = new BehaviorSubject<TickerState>(
    TickerState.NOCHANGE
  );
  public smaCross$ = this._smaCrossSubject$.asObservable();

  // RSI
  private _rsi: RSI;
  private _rsiSubject$ = new BehaviorSubject<string>('Loading');
  public rsi$? = this._rsiSubject$.asObservable();

  // Signal
  private _signal$ = new BehaviorSubject<TickerState>(TickerState.NOCHANGE);
  public signal$ = this._signal$.asObservable();

  // State (UP/DOWN)
  public state$?: Observable<TickerState>;
  public State = TickerState;

  constructor() {
    this.ticker = null;
    this._sma5 = new SMA(5);
    this._sma13 = new SMA(13);
    this._rsi = new RSI(14);
  }

  ngOnInit(): void {
    this.state$ = this.ticker?.price$.pipe(
      tap((price) => {
        this._sma5.update(price);
        this._sma13.update(price);
        this._rsi.update(price);
      }),
      tap(() => {
        if (this._rsi.isStable) {
          this._rsiSubject$.next(this._rsi.getResult().toFixed(2));
        }
        if (this._sma5.isStable && this._sma13.isStable) {
          const sma5 = this._sma5.getResult();
          const sma10 = this._sma13.getResult();
          if (sma5.gt(sma10)) {
            this._smaCrossSubject$.next(TickerState.UP);
          }
          if (sma5.lt(sma10)) {
            this._smaCrossSubject$.next(TickerState.DOWN);
          }
          if (sma5.eq(sma10)) {
            this._smaCrossSubject$.next(TickerState.NOCHANGE);
          }
        }
      }),
      tap(() => {
        if (this._rsi.isStable && this._smaCrossSubject$.value != null) {
          if (
            this._rsi.getResult().gt(70) &&
            this._smaCrossSubject$.value === TickerState.UP
          ) {
            this._signal$.next(TickerState.UP);
          }
          if (
            this._rsi.getResult().lt(30) &&
            this._smaCrossSubject$.value === TickerState.DOWN
          ) {
            this._signal$.next(TickerState.DOWN);
          }
        }
      }),
      pairwise(),
      map((pairValue: [number, number]) => {
        if (pairValue[0] < pairValue[1]) {
          return TickerState.UP;
        } else if (pairValue[0] > pairValue[1]) {
          return TickerState.DOWN;
        }
        return TickerState.NOCHANGE;
      })
    );
  }
}
