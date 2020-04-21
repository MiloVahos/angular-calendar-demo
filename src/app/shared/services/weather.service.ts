import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WEATHER_API_BASE_URL, WEATHER_API_KEY } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http: HttpClient) { }

  getForecastByCity(city: string) {
    return this.http.get(`${WEATHER_API_BASE_URL}?q=${city}&cnt=2,co&appid=${WEATHER_API_KEY}`)
                    .toPromise();
  }

}
