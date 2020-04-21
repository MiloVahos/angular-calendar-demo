import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './components/calendar/calendar.component';
import { CalendarRoutingModule } from './calendar-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
  declarations: [CalendarComponent],
  imports: [
    CommonModule,
    CalendarRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ColorPickerModule,
  ]
})
export class CalendarModule { }
