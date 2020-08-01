import { Component } from '@angular/core';
import { UserService } from '../../../Models/Services/user.service';
import { Rental } from '../../../Models/Classes/rental';
import { RentalService } from '../../../Models/Services/rental.service';

@Component({
  selector: 'app-last-orders',
  templateUrl: './last-orders.component.html',
  styleUrls: ['./last-orders.component.css']
})
export class LastOrdersComponent {

  userRentals: Rental[];
  deletedRental: Rental;

  constructor(private userService: UserService, private rentalService: RentalService) { }

  ngOnInit() {
    this.userService.getUserRentals(this.userService.userId)
      .subscribe(
        resp => this.userRentals = resp,
        error => {
          alert(error);
          this.userRentals = [];
        }
      );
  }

  rentalStatus(rent: Rental): string {
    let today: number = new Date().getTime()
    //  finished, upcoming, ongoing
    if (rent.ActualReturnDate)
      return "finished";
    if (new Date(rent.PickUpDate).getTime() > today)
      return "upcoming";
    return "ongoing";
  }

  futureRental(pickUpDate: Date): boolean {
    let today: number = new Date().getTime();
    if (today < new Date(pickUpDate).getTime())
      return true;
    return false;
  }

  cancelRental(rentalId: number, index): void {
    if (confirm("Are you sure that you want to cancel this rental?")) {
      this.rentalService.deleteRental(rentalId).subscribe(
        resp => this.userRentals.splice(index),
        error => alert(error));
    }
  }
}
