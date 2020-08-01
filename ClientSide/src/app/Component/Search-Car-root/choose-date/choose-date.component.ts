import { Component, EventEmitter, Output } from '@angular/core';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { RentalDates } from '../../../Models/Classes/rental';

const equals = (one: NgbDateStruct, two: NgbDateStruct) =>
  one && two && two.year === one.year && two.month === one.month && two.day === one.day;

const before = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day < two.day : one.month < two.month : one.year < two.year;

const after = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day > two.day : one.month > two.month : one.year > two.year;

@Component({
  selector: 'app-choose-date',
  templateUrl: './choose-date.component.html',
  styleUrls: ['./choose-date.component.css']
})
export class ChooseDateComponent {

  @Output('choosenDates') choosenDates = new EventEmitter<RentalDates>();

  hoveredDate: NgbDateStruct;
  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;
  minDate: NgbDateStruct;
  selectDateInfo: string;
  totalDays: number;

  constructor(calendar: NgbCalendar) {
    this.minDate = calendar.getToday();
    this.selectDateInfo = `Click on your pickup date - NOT before ${this.minDate.day}/${this.minDate.month}/${this.minDate.year}`
    //this.fromDate = calendar.getToday();
    //this.toDate = calendar.getNext(calendar.getToday(), 'd', 7);
  }

  onDateSelection(date: NgbDateStruct): void {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
      this.selectDateInfo = "Click on your return date";
    } else if (this.fromDate && !this.toDate && after(date, this.fromDate)) {
      this.toDate = date;
      this.totalDays = this.calculateTotalDays(this.fromDate, this.toDate) + 1
      this.choosenDates.emit(
        new RentalDates(
          `${this.fromDate.month}-${this.fromDate.day}-${this.fromDate.year}`,
          `${this.toDate.month}-${this.toDate.day}-${this.toDate.year}`,
          this.totalDays
        )
      );
      this.selectDateInfo = `Total days - ${this.totalDays}`;
    } else {
      this.toDate = null;
      this.fromDate = date;
      this.selectDateInfo = "Click on your return date";
    }
  }

  isHovered = date => this.fromDate && !this.toDate && this.hoveredDate && after(date, this.fromDate) && before(date, this.hoveredDate);
  isInside = date => after(date, this.fromDate) && before(date, this.toDate);
  isFrom = date => equals(date, this.fromDate);
  isTo = date => equals(date, this.toDate);

  calculateTotalDays(fromDate: NgbDateStruct, toDate: NgbDateStruct): number {
    let oneDay = 24 * 60 * 60 * 1000;
    let from = new Date(`${fromDate.year},${fromDate.month - 1},${fromDate.day}`).getTime();
    let to = new Date(`${toDate.year},${toDate.month - 1},${toDate.day}`).getTime();
    return Math.round(Math.abs((to - from) / (oneDay)));
  }
}



