import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { EventComponent } from './components/event/event.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    HomeComponent,
    EventComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
  ],
  exports: [
    EventComponent,
  ]
})
export class SharedModule { }
