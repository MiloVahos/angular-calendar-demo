import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Day } from '../../models/day.model';
import { ShareDataService } from '../../../shared/services/share-data.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  momentCalendar = [];
  myCalendar = [];
  month: string;

  constructor(private shareDataService: ShareDataService) {
    this.shareDataService.currentData.subscribe( (data) => this.saveReminder(data) );
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
          reminders: [
            { description: 'Esto es una descripcion de 30', date: new Date(),
              startTime: '00:00', endTime: '00:00', city: 'MDE' }
          ]
        };
        w.push(d);
      });
      this.myCalendar.push(w);
    });
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
            }
          });
        });
      }
    }
  }

}
