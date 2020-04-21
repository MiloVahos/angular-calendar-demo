import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Day } from '../../models/day.model';
import { ShareDataService } from '../../../shared/services/share-data.service';
import * as _ from 'underscore';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GenericValidations } from '../../../../utils/generic-validators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Reminder } from '../../../shared/models/reminder.model';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  momentCalendar = [];
  myCalendar = [];
  month: string;
  form: FormGroup;
  closeResult = '';
  minDate = moment().startOf('month').format('MM/DD/YYYY');
  maxDate = moment().endOf('month').format('MM/DD/YYYY');
  today = moment().format('MM/DD/YYYY');
  cities = ['Bogotá', 'Medellín', 'Cartagena', 'Cali', 'Santa Marta', 'Barranquilla',
            'Pereira', 'Bucaramanga', 'Cúcuta'];
  color = '#ffffff';
  reminder: any;

  constructor(private shareDataService: ShareDataService,
              private modalService: NgbModal) {
    this.shareDataService.currentData.subscribe( (data) => this.saveReminder(data) );
    this.form = new FormGroup({
      description: new FormControl( null, Validators.required ),
      day: new FormControl( null, Validators.required ),
      startTime: new FormControl( null, Validators.required ),
      endTime: new FormControl( null, Validators.required ),
      city: new FormControl( 'Bogotá' )
    }, GenericValidations.validateTimesOrder('startTime', 'endTime'));
  }

  ngOnInit() {
    const startWeek = moment().startOf('month').week();
    const endWeek = moment().endOf('month').week();
    this.month = moment().format('MMMM');
    for ( let week = startWeek; week <= endWeek; week++ ) {
      this.momentCalendar.push({
        week,
        days: Array(7).fill(0).map((n, i) => moment().week(week).startOf('week').clone().add(n + i, 'day')),
      });
    }
    this.buildMyCalendar();
  }

  buildMyCalendar() {
    this.momentCalendar.forEach( week => {
      const w = [];
      week.days.forEach( day => {
        const d: Day = {
          dayNumber: day.format('D'),
          belongsCurrent: (day.month() === moment().month()) ? false : true,
          reminders: [],
        };
        w.push(d);
      });
      this.myCalendar.push(w);
    });
  }

  sortByTime(time1: string, time2: string) {
    const hour1 = parseInt(time1.substring(0, 2), 10);
    const min1 = parseInt(time1.substring(3, 5), 10);
    const hour2 = parseInt(time2.substring(0, 2), 10);
    const min2 = parseInt(time2.substring(3, 5), 10);
    if ( hour1 < hour2 ) {
      return -1;
    } else if ( hour1 > hour2 ) {
      return 1;
    } else {
      if ( min1 < min2 ) {
        return -1;
      } else if ( min1 > min2 ) {
        return 1;
      } else {
        return 0;
      }
    }
  }

  saveReminder(value: any) {
    if ( value && !_.isEmpty(value) && !_.isUndefined(value) ) {
      const date = moment(value.date, 'YYYY-MM-DD');
      const day = date.format('D');
      const month = parseInt(date.format('M'), 10);
      const year = parseInt(date.format('YYYY'), 10);
      const currentDate = new Date();
      if ( year === currentDate.getFullYear() && month === (currentDate.getMonth() + 1) ) {
        this.myCalendar.forEach( week => {
          week.forEach( d => {
            if ( !d.belongsCurrent && d.dayNumber === day ) {
              d.reminders.push(value);
              d.reminders.sort((a , b) => {
                return this.sortByTime(a.startTime, b.startTime);
              });
            }
          });
        });
      }
    }
  }

  open(content, reminder, w, d, r) {
    this.reminder = reminder;
    this.form.controls.description.setValue(reminder.description);
    this.form.controls.startTime.setValue(reminder.startTime);
    this.form.controls.endTime.setValue(reminder.endTime);
    this.color = reminder.color;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if ( result === 'Update' ) {
        this.updateReminder(w, d, r);
      }
    }, (reason) => console.log(reason));
  }

  updateReminder(w, d, r) {
    const reminder: Reminder = {
      description: this.form.value.description,
      date: this.form.value.day,
      startTime: this.form.value.startTime,
      endTime: this.form.value.endTime,
      weather: this.reminder.weather,
      city: this.form.value.city,
      color: this.color,
    };
    delete this.myCalendar[w][d].reminders[r];
    this.saveReminder(reminder);
  }

}
