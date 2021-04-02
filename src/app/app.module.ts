import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { TickerAddFormComponent } from './ticker-add-form/ticker-add-form.component';
import { TickerComponent } from './ticker/ticker.component';
import { TickerListComponent } from './ticker-list/ticker-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TickerTrackerComponent } from './ticker-tracker/ticker-tracker.component';
import { TickerFormatPipe } from './ticker-tracker/ticker-format.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    TickerAddFormComponent,
    TickerComponent,
    TickerFormatPipe,
    TickerListComponent,
    TickerTrackerComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
