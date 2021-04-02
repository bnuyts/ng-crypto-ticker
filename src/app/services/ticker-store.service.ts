import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

import { Ticker } from '../ticker/ticker.model';
import { MiniTickerStorageService } from './mini-ticker-storage.service';

const imageUrl = 'assets/icons/';

interface SocketMessage {
  method: string;
  params: string[];
  id: number;
}

interface MiniTicker {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  c: string; // Close price
  o: string; // Open price
  h: string; // High price
  l: string; // Low price
  v: string; // Total traded base asset volume
  q: string; // Total traded quote asset volume
}

@Injectable({
  providedIn: 'root',
})
export class TickerStoreService {
  private _lastUpdateEpoch: BehaviorSubject<number> = new BehaviorSubject<number>(
    0
  );
  private _socket?: WebSocketSubject<SocketMessage | MiniTicker>;
  private _tickerData: Map<string, Ticker> = new Map<string, Ticker>();
  private _tickers: BehaviorSubject<Ticker[]> = new BehaviorSubject<Ticker[]>(
    []
  );

  public tickers$: Observable<Ticker[]> = this._tickers.asObservable();
  public lastUpdateEpoch$: Observable<number> = this._lastUpdateEpoch.asObservable();

  constructor(
    private readonly miniTickerStorageService: MiniTickerStorageService
  ) {
    this._connectToSocket();
    this.miniTickerStorageService.miniTickerList$
      .pipe(filter((list) => list.length > 0))
      .subscribe((list) =>
        this._socket?.next({
          method: 'SUBSCRIBE',
          params: list,
          id: 1,
        })
      );
    this.miniTickerStorageService.miniTickerRemovals$.subscribe(
      (removedTicker) => {
        this._socket?.next({
          method: 'UNSUBSCRIBE',
          params: [removedTicker],
          id: 1,
        });
      }
    );
  }

  public addTicker(ticker: string) {
    this.miniTickerStorageService.add(ticker);
  }

  public updateTickerData(ticker: { symbol: string; price: number }) {
    const tickerData = this._tickerData.get(ticker.symbol);
    if (tickerData != null) {
      tickerData.price$.next(ticker.price);
    } else {
      this._tickerData.set(ticker.symbol, {
        imageUrl: `${imageUrl}${ticker.symbol
          .replace('USDT', '')
          .toLowerCase()}.svg`,
        price$: new BehaviorSubject(ticker.price),
        symbol: ticker.symbol,
      });
      this._tickers.next(Array.from(this._tickerData.values()));
    }
  }

  private _connectToSocket() {
    this._socket?.unsubscribe();

    this._socket = webSocket<SocketMessage | MiniTicker>(
      'wss://stream.binance.com:9443/ws'
    );
    this._socket.subscribe(
      (output) => {
        const miniTicker = output as MiniTicker;
        if (miniTicker.s != null && miniTicker.c != null) {
          this.updateTickerData({
            symbol: miniTicker.s,
            price: +miniTicker.c,
          });
          if (miniTicker.E > this._lastUpdateEpoch.value) {
            this._lastUpdateEpoch.next(miniTicker.E);
          }
        }
      },
      () => this._connectToSocket(),
      () => this._connectToSocket()
    );
  }
}
