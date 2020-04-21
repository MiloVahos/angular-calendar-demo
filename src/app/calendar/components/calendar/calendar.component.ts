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
              startTime: '00:00', endTime: '00:01', city: 'MDE', weather: 'Rain' }
          ]
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

}
