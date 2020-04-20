import { Reminder } from '../../shared/models/reminder.model';

export class Day {
  public dayNumber: number;
  public belongsCurrent: boolean;
  public reminders: Reminder[];
}
