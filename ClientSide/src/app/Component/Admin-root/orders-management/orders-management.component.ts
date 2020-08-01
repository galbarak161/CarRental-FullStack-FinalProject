import { Component } from '@angular/core';
import { Rental } from '../../../Models/Classes/rental';
import { CarService } from '../../../Models/Services/car.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RentalService } from '../../../Models/Services/rental.service';

@Component({
  selector: 'app-orders-management',
  templateUrl: './orders-management.component.html',
  styleUrls: ['./orders-management.component.css']
})
export class OrdersManagementComponent {

  //Form
  sortForm: FormGroup;
  sortOptions: FormControl;

  //variables
  sortBy: boolean;
  rentals: Rental[];
  constructor(private carService: CarService, private rentalService: RentalService) {
    this.sortBy = false;
  }

  ngOnInit() {
    this.initFormControls();
    this.sortForm = new FormGroup({
      sortOptions: this.sortOptions,
    });

    this.rentalService.getRentals()
      .subscribe(
        resp => this.rentals = resp,
        error => alert(error)
      );
  }

  initFormControls() {
    this.sortOptions = new FormControl('', [Validators.required]);
  }

  sortByCarId(): void {
    this.rentals.sort(this.compareCarId);
  }

  sortByPickUpDate(): void {
    this.rentals.sort(this.comparePickUpDate);
  }

  compareCarId(a: Rental, b: Rental): number {
    if (a.CarId < b.CarId)
      return -1;

    if (a.CarId > b.CarId)
      return 1;

    if (a.CarId == b.CarId)
      return (a.PickUpDate < b.PickUpDate) ? -1 : (a.PickUpDate > b.PickUpDate) ? 1 : 0;
  }

  comparePickUpDate(a: Rental, b: Rental): number {
    if (a.PickUpDate < b.PickUpDate)
      return -1;

    if (a.PickUpDate > b.PickUpDate)
      return 1;

    if (a.PickUpDate == b.PickUpDate)
      return (a.ActualReturnDate < b.ActualReturnDate) ? -1 : (a.ActualReturnDate > b.ActualReturnDate) ? 1 : 0;
  }

  rentalStatus(rent: Rental): string {
    let today: number = new Date().getTime()
    if (rent.ActualReturnDate)
      return "Finished";
    if (new Date(rent.PickUpDate).getTime() > today)
      return "Upcoming";
    return "Ongoing";
  }
}


