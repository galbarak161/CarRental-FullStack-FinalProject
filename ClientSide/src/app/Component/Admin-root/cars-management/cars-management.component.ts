import { Component } from '@angular/core';
import { Car, CarType } from '../../../Models/Classes/car';
import { CarService } from '../../../Models/Services/car.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Branch } from '../../../Models/Classes/branch';
import { BranchService } from '../../../Models/Services/branch.service';

@Component({
  selector: 'app-cars-management',
  templateUrl: './cars-management.component.html',
  styleUrls: ['./cars-management.component.css']
})
export class CarsManagementComponent {

  selectedCarType: CarType;
  branches: Branch[];
  carTypeFormVisible: boolean;
  carFormVisible: boolean;
  carTypes: CarType[];
  minProductionYear: number;
  maxProductionYear: number;

  //Form
  CarTypeForm: FormGroup;
  manufacturer: FormControl;
  model: FormControl;
  dailyPrice: FormControl;
  delayedPrice: FormControl;
  transmission: FormControl;
  productionYear: FormControl;
  image: FormControl;

  CarForm: FormGroup;
  carId: FormControl;
  mileage: FormControl;
  status: FormControl;
  branchId: FormControl;

  constructor(private carService: CarService, private branchService: BranchService) {
    this.maxProductionYear = new Date().getFullYear();
    this.minProductionYear = this.maxProductionYear - 5;
    this.carTypeFormVisible = false;
    this.carFormVisible = false;
  }

  ngOnInit() {
    this.initFormControls();
    this.CarTypeForm = new FormGroup({
      manufacturer: this.manufacturer,
      model: this.model,
      dailyPrice: this.dailyPrice,
      delayedPrice: this.delayedPrice,
      transmission: this.transmission,
      productionYear: this.productionYear,
      image: this.image,
    });

    this.CarForm = new FormGroup({
      carId: this.carId,
      mileage: this.mileage,
      status: this.status,
      branchId: this.branchId,
    });

    this.carService.getCarsType()
      .subscribe(
        resp => this.carTypes = resp,
        error => alert(error)
      );

    this.branchService.getAllBranches()
      .subscribe(
        resp => {
          this.branches = resp;
        },
        error => alert("We can't show our branches at this moment; Please come back later")
      );
  }

  initFormControls() {
    this.manufacturer = new FormControl("", [
      Validators.required,
      Validators.maxLength(20),
      Validators.minLength(2),
      Validators.pattern("[a-zA-Z ]*")
    ]);

    this.model = new FormControl("", [
      Validators.required,
      Validators.maxLength(20),
      Validators.minLength(2),
    ]);

    this.dailyPrice = new FormControl("", [
      Validators.required,
      Validators.min(1),
      Validators.pattern(/^-?(0|[1-9]\d*)?$/)
    ]);

    this.delayedPrice = new FormControl("", [
      Validators.required,
      Validators.min(1),
      Validators.pattern(/^-?(0|[1-9]\d*)?$/)
    ]);

    this.transmission = new FormControl("", [
      Validators.required,
    ]);

    this.productionYear = new FormControl("", [
      Validators.required,
      Validators.max(this.maxProductionYear),
      Validators.min(this.minProductionYear),
      Validators.pattern(/^\w{4}$/),
      Validators.pattern(/^-?(0|[1-9]\d*)?$/)
    ]);

    this.image = new FormControl("", [
      Validators.maxLength(250),
      Validators.pattern(/^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/)
    ]);

    // ----------------------------------------------------

    this.carId = new FormControl("", [
      Validators.required,
      Validators.pattern(/^\w{7,9}$/),
      Validators.pattern(/^-?(0|[1-9]\d*)?$/)
    ]);

    this.mileage = new FormControl("", [
      Validators.required,
      Validators.min(1),
      Validators.pattern(/^-?(0|[1-9]\d*)?$/)
    ]);

    this.status = new FormControl("", [
      Validators.required,
    ]);

    this.branchId = new FormControl("", [
      Validators.required,
    ]);
  }

  toggleCarTypeForm(carType?: CarType): void {
    if (this.carFormVisible) {
      this.carFormVisible = false;
      this.selectedCarType = null;
    }
    if (carType) {
      if (this.selectedCarType) {
        if (carType.TypeId == this.selectedCarType.TypeId) {
          this.carTypeFormVisible = !this.carTypeFormVisible;
          this.selectedCarType = null;
          this.CarTypeForm.reset();
          return;
        }
      }
      this.selectedCarType = carType;
      this.carTypeFormVisible = true;
      this.manufacturer.setValue(this.selectedCarType.Manufacturer);
      this.model.setValue(this.selectedCarType.Model);
      this.dailyPrice.setValue(this.selectedCarType.DailyPrice);
      this.delayedPrice.setValue(this.selectedCarType.DelayedPrice);
      this.transmission.setValue(this.selectedCarType.Transmission);
      this.productionYear.setValue(this.selectedCarType.ProductionYear);
      this.image.setValue(this.selectedCarType.Image);
    }
    else {
      this.selectedCarType = null;
      this.CarTypeForm.reset();
      this.carTypeFormVisible = true;
    }
  }

  toggleAddCarForm(carType: CarType): void {
    this.carTypeFormVisible = false;
    this.carFormVisible = true;
    this.selectedCarType = carType;
  }

  addCar(): void {
    if (this.CarForm.valid)
      this.carService.addCar(new Car(
        this.carId.value,
        this.selectedCarType.TypeId,
        this.mileage.value,
        this.status.value,
        this.branchId.value)
      )
        .subscribe(
          newCar =>
            error => alert("error"),
          () => {
            alert("Completed");
            this.carFormVisible = false;
            this.CarForm.reset();
          });
    else
      alert("All fields are mandatory");
  }

  addCarType(): void {
    if (this.CarTypeForm.valid)
      this.carService.addCarType(new CarType(
        this.manufacturer.value,
        this.model.value,
        this.dailyPrice.value,
        this.delayedPrice.value,
        this.transmission.value,
        this.productionYear.value,
        this.image.value)
      )
        .subscribe(
          newCarType => this.carTypes.unshift(newCarType),
          error => alert("error"),
          () => {
            alert("Completed");
            this.carTypeFormVisible = false;
            this.CarTypeForm.reset();
          });
    else
      alert("All fields are mandatory");
  }

  updateCarType(): void {
    if (this.CarTypeForm.valid) {
      this.carService.updateCarType(this.selectedCarType.TypeId, new CarType(
        this.manufacturer.value,
        this.model.value,
        this.dailyPrice.value,
        this.delayedPrice.value,
        this.transmission.value,
        this.productionYear.value,
        this.image.value,
        this.selectedCarType.TypeId)
      ).subscribe(
        updatedCarType => this.selectedCarType = updatedCarType,
        error => alert("error"),
        () => {
          alert("Car Type updated");
          this.carTypeFormVisible = false;
          for (let i = 0; i < this.carTypes.length; i++) {
            if (this.carTypes[i].TypeId == this.selectedCarType.TypeId)
              this.carTypes[i] = this.selectedCarType;
          }
        });
    }
    else
      alert("All fields are mandatory");
  }

}
