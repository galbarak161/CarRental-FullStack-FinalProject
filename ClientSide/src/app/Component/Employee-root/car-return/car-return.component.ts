import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { CarType, Car } from '../../../Models/Classes/car';
import { CarService } from '../../../Models/Services/car.service';
import { Rental } from '../../../Models/Classes/rental';
import { BranchService } from '../../../Models/Services/branch.service';
import { CustomValidators } from '../../../Models/Others/CustomValidators';
import { RentalService } from '../../../Models/Services/rental.service';

@Component({
  selector: 'app-car-return',
  templateUrl: './car-return.component.html',
  styleUrls: ['./car-return.component.css']
})
export class CarReturnComponent {

  carType: CarType;
  car: Car;
  rental: Rental;

  carMileage: number;
  actualReturnDate: Date;
  disable: boolean;

  //Form
  carReturnForm: FormGroup;
  carId: FormControl;
  PickUpDate: FormControl;
  isFix: FormControl;
  mileage: FormControl;

  constructor(private carService: CarService, private branchService: BranchService, private rentalService: RentalService) {
    this.actualReturnDate = new Date();
    this.disable = false;
  }

  ngOnInit() {
    this.initFormControls();
    this.carReturnForm = new FormGroup({
      carId: this.carId,
      PickUpDate: this.PickUpDate,
      isFix: this.isFix,
      mileage: this.mileage
    });
  }

  initFormControls(): void {
    this.carId = new FormControl('', [
      Validators.required,
      Validators.pattern(/^\w{7,9}$/),
      Validators.pattern(/^-?(0|[1-9]\d*)?$/)
    ]);

    this.PickUpDate = new FormControl('', [
      CustomValidators.pickUpDateValidation()]);

    this.isFix = new FormControl("", [
      Validators.required
    ]);

    this.mileage = new FormControl("0");

  }

  getRentalDetails(): void {
    if (this.carId.valid && this.carId.dirty && this.PickUpDate.dirty && this.PickUpDate.valid) {
      this.getRental();
      this.getCarType();
      this.carService.getCarById(this.carId.value).subscribe(
        car => this.car = car,
        error => console.log(error),
        () => {
          this.carMileage = this.car.Mileage;
          //this.carReturnForm.get('mileage').setValidators(CustomValidators.mileageValidation(this.carMileage));
          this.carReturnForm.get('mileage').setValidators(
            [
              Validators.required,
              Validators.pattern(/^-?(0|[1-9]\d*)?$/),
              CustomValidators.mileageValidation(this.carMileage)
            ])
          this.carReturnForm.get('mileage').updateValueAndValidity();
          this.mileage.setValue(this.carMileage);
        }
      )
    }
    else
      alert("Write the car Id and rental pick Up date");
  }

  getCarType(): void {
    if (this.carId.valid && this.PickUpDate.valid) {
      this.carService.getCarTypeByCarId(this.carId.value).subscribe(
        carType => this.carType = carType,
        error => console.log(error),
      )
    }
  }

  getRental(): void {
    if (this.carId.valid && this.PickUpDate.valid) {
      this.rentalService.getRentalByCarIdAndPickUpDate(this.carId.value, this.PickUpDate.value).subscribe(
        rental => {
          if (rental) {
            this.rental = rental;
            this.disable = true;
          }
          else alert("This rental has already finished");
        },
        error => alert("No match"),
      )
    }
  }

  totalDays: number;
  calculateTotalDays(): number {
    let oneDay = 24 * 60 * 60 * 1000;
    let from = new Date(this.PickUpDate.value).getTime();
    let to = new Date(this.actualReturnDate).getTime();
    this.totalDays = Math.round(Math.abs((to - from) / (oneDay)));
    return this.totalDays;
  }

  delayDays: number;
  calculateDelayDays(): number {
    let oneDay = 24 * 60 * 60 * 1000;
    let from = new Date(this.actualReturnDate).getTime();
    let to = new Date(this.rental.ReturnDate).getTime();
    if (from < to) {
      this.delayDays = 0;
      return this.delayDays;
    }
    this.delayDays = Math.round(Math.abs((to - from) / (oneDay)) - 1);
    return this.delayDays;
  }

  totalPrice(): number {
    return (
      ((this.totalDays - this.delayDays) * this.carType.DailyPrice) +
      (this.delayDays * this.carType.DelayedPrice));
  }

  confirmReturn(): void {
    let updatedCar: Car = new Car(
      this.car.CarId,
      this.carType.TypeId,
      this.mileage.value,
      this.isFix.value,
      Number.parseInt(this.branchService.branchId)
    )

    let returnRent: Rental = new Rental(
      this.rental.Id,
      this.rental.UserId,
      this.rental.CarId,
      this.rental.PickUpDate,
      this.rental.ReturnDate,
      this.actualReturnDate,
      this.totalDays,
      this.totalPrice()
    );

    this.rentalService.updateRental(this.rental.Id, returnRent).subscribe(
      updatedRent => alert("The request was received... Please wait..."),
      error => alert(error),
      () => {
        this.carService.updateCar(updatedCar.CarId, updatedCar).subscribe(
          updatedCar => alert("Car has been returned!"),
          error => alert(error),
          () => {
            this.rental = null;
            this.carType = null;
            this.disable = false;
            this.carReturnForm.reset();
          });
      }
    );
  }

  isEmployeeFinished(): boolean {
    return false;
  }
}
