import { ValidatorFn, FormGroup } from '@angular/forms';

export class GenericValidations {

  public static validateTimesOrder(start: string, end: string): ValidatorFn {
    return (fg: FormGroup) => {
      const startHour = fg.get(start).value ? fg.get(start).value : '00:00';
      const endHour = fg.get(end).value ? fg.get(end).value : '00:00';
      const startTime = new Date();
      const endTime = new Date();
      startTime.setHours(parseInt(startHour.substring(0, 2), 10), parseInt(startHour.substring(3, 5), 10));
      endTime.setHours(parseInt(endHour.substring(0, 2), 10), parseInt(endHour.substring(3, 5), 10));
      return startTime !== null && endTime !== null && startTime < endTime ? null : { range: true };
    };
  }

}
