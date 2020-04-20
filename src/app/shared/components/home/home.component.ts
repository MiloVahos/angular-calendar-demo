import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { GenericValidations } from '../../../../utils/generic-validators';
import { Reminder } from '../../models/reminder.model';
import { ShareDataService } from '../../services/share-data.service';

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

  constructor(private modalService: NgbModal,
              private shareDataService: ShareDataService) {
    this.form = new FormGroup({
      description: new FormControl( null, Validators.required ),
      day: new FormControl( null, Validators.required ),
      startTime: new FormControl( null, Validators.required ),
      endTime: new FormControl( null, Validators.required ),
      city: new FormControl( 'Bogotá' ),
    }, GenericValidations.validateTimesOrder('startTime', 'endTime'));
  }

  ngOnInit() { }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if ( result === 'Save' ) {
        this.saveReminder();
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  saveReminder() {
    const reminder: Reminder = {
      description: this.form.value.description,
      date: this.form.value.day,
      startTime: this.form.value.startTime,
      endTime: this.form.value.endTime,
      city: this.form.value.city,
    };
    this.form.reset();
    this.shareDataService.changeData(reminder);
  }

}
