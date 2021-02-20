import { BehaviorSubject } from 'rxjs';

export interface Ticker {
  imageUrl: string;
  symbol: string;
  price$: BehaviorSubject<number>;
}
