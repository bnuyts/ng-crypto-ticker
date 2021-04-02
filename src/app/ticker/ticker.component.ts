import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, pairwise, tap } from 'rxjs/operators';
import { EMA, RSI } from 'trading-signals';
import { Ticker, TickerState } from './ticker.model';

@Component({
  selector: '[app-ticker]',
  templateUrl: './ticker.component.html',
  styleUrls: ['./ticker.component.scss'],
})
export class TickerComponent implements OnInit {
  @Input()
  public ticker: Ticker | null;

  // EMA 5-10 cross
  private _ema5: EMA;
  private _ema13: EMA;
  private _emaCrossSubject$ = new BehaviorSubject<TickerState>(
    TickerState.NOCHANGE
  );
  public emaCross$ = this._emaCrossSubject$.asObservable();

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
    this._ema5 = new EMA(5);
    this._ema13 = new EMA(13);
    this._rsi = new RSI(14);
  }

  ngOnInit(): void {
    this.state$ = this.ticker?.price$.pipe(
      tap((price) => {
        this._ema5.update(price);
        this._ema13.update(price);
        this._rsi.update(price);
      }),
      tap(() => {
        if (this._rsi.isStable) {
          this._rsiSubject$.next(this._rsi.getResult().toFixed(2));
        }
        if (this._ema5.isStable && this._ema13.isStable) {
          const ema5 = this._ema5.getResult();
          const ema10 = this._ema13.getResult();
          if (ema5.gt(ema10)) {
            this._emaCrossSubject$.next(TickerState.UP);
          }
          if (ema5.lt(ema10)) {
            this._emaCrossSubject$.next(TickerState.DOWN);
          }
          if (ema5.eq(ema10)) {
            this._emaCrossSubject$.next(TickerState.NOCHANGE);
          }
        }
      }),
      tap(() => {
        if (this._rsi.isStable && this._emaCrossSubject$.value != null) {
          if (
            this._rsi.getResult().gt(70) &&
            this._emaCrossSubject$.value === TickerState.UP
          ) {
            this._signal$.next(TickerState.UP);
          }
          if (
            this._rsi.getResult().lt(30) &&
            this._emaCrossSubject$.value === TickerState.DOWN
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
