import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { WeatherService } from './services/weather.service';
import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
  declarations: [
    HomeComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ColorPickerModule,
  ],
  providers: [
    WeatherService,
  ]
})
export class SharedModule { }
