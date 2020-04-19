import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Day } from '../../models/day.model';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  momentCalendar = [];
  myCalendar = [];
  month: string;

  constructor() { }

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
    console.log(this.momentCalendar);
    this.buildMyCalendar();
    console.log(this.myCalendar);
  }

  buildMyCalendar() {
    this.momentCalendar.forEach( week => {
      const w = [];
      week.days.forEach( day => {
        const d: Day = {
          dayNumber: day.format('D'),
          belongsCurrent: (day.month() === moment().month()) ? false : true
        };
        w.push(d);
      });
      this.myCalendar.push(w);
    });
  }


}
