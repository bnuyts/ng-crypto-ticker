import { TestBed } from '@angular/core/testing';

import { TickerStoreService } from './ticker-store.service';

describe('TickerStoreService', () => {
  let service: TickerStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TickerStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
