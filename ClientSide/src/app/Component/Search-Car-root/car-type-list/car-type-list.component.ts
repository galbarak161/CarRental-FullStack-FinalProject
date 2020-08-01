import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CarService } from '../../../Models/Services/car.service';
import { CarType } from '../../../Models/Classes/car';
import { RentalDates, RentalsFacade, Rental, TempRental } from '../../../Models/Classes/rental';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Branch } from '../../../Models/Classes/branch';
import { RentalService } from '../../../Models/Services/rental.service';

@Component({
  selector: 'app-car-type-list',
  templateUrl: './car-type-list.component.html',
  styleUrls: ['./car-type-list.component.css']
})
export class CarTypeListComponent {

  _rentalDates: RentalDates;
  @Input()
  set rentalDates(rentalDates: RentalDates) {
    if (rentalDates) {
      this._rentalDates = rentalDates;
      if (this.choosenBranch)
        this.getTypeByDateAndBranch();
    }
  }
  get rentalDates() { return this._rentalDates; }

  _choosenBranch: Branch;
  @Input()
  set choosenBranch(choosenBranch: Branch) {
    if (choosenBranch) {
      this._choosenBranch = choosenBranch;
      if (this.rentalDates)
        this.getTypeByDateAndBranch();
    }
  }
  get choosenBranch() { return this._choosenBranch; }

  @Output('typeToRent') typeToRent = new EventEmitter<CarType>();

  carTypes: CarType[];
  choosenType: CarType;
  newRent: Rental;
  carServiceError: string;

  //Form
  filterForm: FormGroup;
  filterOptions: FormControl;
  filterValue: FormControl;

  constructor(private carService: CarService, private rentalService:RentalService, private router: Router) { }

  ngOnInit() {
    if (!this.rentalDates && !this.choosenBranch)
      this.getAllType();

    this.initFormControls();
    this.filterForm = new FormGroup({
      filterOptions: this.filterOptions,
      filterValue: this.filterValue,
    });
  }

  initFormControls() {
    this.filterOptions = new FormControl("", []);
    this.filterValue = new FormControl("", []);
  }

  getAllType(): void {
    this.carService.getCarsType()
      .subscribe(
        resp => this.carTypes = resp,
        error => alert("We can't show our cars at this moment; Please come back later")
      );
  }

  getTypeByDateAndBranch(): void {
    this.carService.getTypeByDatesAndBranch(this.choosenBranch.BranchId, this.rentalDates.PickUpDate, this.rentalDates.ReturnDate)
      .subscribe(
        resp => {
          this.carTypes = resp;
        },
        error => alert(error)
      );
  }

  filterSwitch(): void {
    this.filterValue.setValue('');
  }

  typeClick(type: CarType): void {
    this.choosenType = type;
  }

  orderThisType(choosenType: CarType): void {
    document.getElementById('closeBtn').click();
    this.typeToRent.emit(choosenType);
  }

  tempRent(carType: CarType):void{
    this.rentalService.saveTempRental(
      new TempRental(
        carType,
        this.rentalDates,
        this.choosenBranch
      )
    )
  }
}


