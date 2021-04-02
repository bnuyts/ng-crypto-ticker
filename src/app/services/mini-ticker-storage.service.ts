import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MiniTickerStorageService {
  private _miniTickerListStorageKey = 'ng-crypto-mini-ticker-list';
  private _miniTickerList: string[] = [];
  private _miniTickerList$ = new BehaviorSubject<string[]>(
    this._miniTickerList
  );
  private _removals$ = new BehaviorSubject<string>('');

  public miniTickerList$ = this._miniTickerList$.asObservable();
  public miniTickerRemovals$ = this._removals$.asObservable();

  constructor() {
    const storedList = localStorage.getItem(this._miniTickerListStorageKey);
    this._miniTickerList =
      storedList != null ? JSON.parse(storedList) : ['btcusdt@miniTicker'];
    this._miniTickerList$.next(this._miniTickerList);
  }

  add(ticker: string) {
    this._miniTickerList.push(`${ticker.toLowerCase()}@miniTicker`);
    this.save();
  }

  remove(ticker: string) {
    const removeIndex = this._miniTickerList.indexOf(ticker);
    if (removeIndex > -1) {
      const [removedTicker] = this._miniTickerList.splice(removeIndex);
      this._removals$.next(removedTicker);
    }
    this.save();
  }

  private save() {
    this._miniTickerList$.next(this._miniTickerList);
    localStorage.setItem(
      this._miniTickerListStorageKey,
      JSON.stringify(this._miniTickerList)
    );
  }
}
