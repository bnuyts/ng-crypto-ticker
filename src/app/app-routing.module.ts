import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TickerListComponent } from './ticker-list/ticker-list.component';

const routes: Routes = [
  {
    path: '',
    component: TickerListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
