import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { MiniTickerStorageService } from '../services/mini-ticker-storage.service';

@Component({
  selector: 'app-ticker-tracker',
  templateUrl: './ticker-tracker.component.html',
  styleUrls: ['./ticker-tracker.component.scss'],
})
export class TickerTrackerComponent {
  public trackingList$: Observable<string[]>;

  constructor(
    private readonly miniTickerStorageService: MiniTickerStorageService
  ) {
    this.trackingList$ = this.miniTickerStorageService.miniTickerList$;
  }

  remove(miniTicker: string) {
    this.miniTickerStorageService.remove(miniTicker);
  }
}
