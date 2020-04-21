import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { GenericValidations } from '../../../../utils/generic-validators';
import { Reminder } from '../../models/reminder.model';
import { ShareDataService } from '../../services/share-data.service';
import { WeatherService } from '../../services/weather.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  form: FormGroup;
  closeResult = '';
  minDate = moment().startOf('month').format('MM/DD/YYYY');
  maxDate = moment().endOf('month').format('MM/DD/YYYY');
  today = moment().format('MM/DD/YYYY');
  cities = ['Bogotá', 'Medellín', 'Cartagena', 'Cali', 'Santa Marta', 'Barranquilla',
            'Pereira', 'Bucaramanga', 'Cúcuta'];
  color = '#ffffff';

  constructor(private modalService: NgbModal,
              private shareDataService: ShareDataService,
              private weatherService: WeatherService) {
    this.form = new FormGroup({
      description: new FormControl( null, Validators.required ),
      day: new FormControl( null, Validators.required ),
      startTime: new FormControl( null, Validators.required ),
      endTime: new FormControl( null, Validators.required ),
      city: new FormControl( 'Bogotá' )
    }, GenericValidations.validateTimesOrder('startTime', 'endTime'));
  }

  async ngOnInit() { }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if ( result === 'Save' ) {
        this.saveReminder();
      }
    }, (reason) => console.log(reason));
  }

  async saveReminder() {
    const reminder: Reminder = {
      description: this.form.value.description,
      date: this.form.value.day,
      startTime: this.form.value.startTime,
      endTime: this.form.value.endTime,
      city: this.form.value.city,
      weather: await this.getWeather(this.form.value.city),
      color: this.color,
    };
    this.form.reset();
    this.shareDataService.changeData(reminder);
  }

  async getWeather(city: string): Promise<string> {
    /* FORECAST IS A PAID SERVICE 
       SO, LETS PRETEND THAT THE TODAYS WEATHER WILL BE THE SAME ON THE DATE*/
    const response = await this.weatherService
    .getForecastByCity(city)
    .then((res: any) => {
      return res.weather[0].main;
    });
    return response;
  }

}
