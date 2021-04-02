import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TickerStoreService } from '../services/ticker-store.service';

@Component({
  selector: 'app-ticker-add-form',
  templateUrl: './ticker-add-form.component.html',
  styleUrls: ['./ticker-add-form.component.scss'],
})
export class TickerAddFormComponent {
  public ticker = new FormControl();

  constructor(private _tickerStore: TickerStoreService) {}

  add() {
    this._tickerStore.addTicker(this.ticker.value);
  }
}
