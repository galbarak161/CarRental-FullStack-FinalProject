import { Component } from '@angular/core';
import { RentalDates } from '../../../Models/Classes/rental';
import { CarType } from '../../../Models/Classes/car';
import { RentalService } from '../../../Models/Services/rental.service';
import { Router } from '@angular/router';
import { UserService } from '../../../Models/Services/user.service';
import { Branch } from '../../../Models/Classes/branch';


@Component({
  selector: 'app-search-car',
  templateUrl: './search-car.component.html',
  styleUrls: ['./search-car.component.css']
})
export class SearchCarComponent {

  rentalDates: RentalDates;
  branch: Branch;
  carType: CarType;

  constructor(private rentalService: RentalService, private router: Router) { }

  choosenDates(choosenDates: RentalDates): void {
    this.rentalDates = choosenDates;
  }

  choosenBranch(choosenBranch: Branch): void {
    this.branch = choosenBranch;
  }

  typeToRent(typeToRent: CarType): void {
    this.rentalService.tempRental = {
      carType: typeToRent,
      branch: this.branch,
      dates: this.rentalDates
    };

    this.router.navigate(['User-Zone'],
      {
        queryParams: {
          typeId: typeToRent.TypeId,
          branchId: this.branch.BranchId,
          pickUpDate: this.rentalDates.PickUpDate,
          returnDate: this.rentalDates.ReturnDate
        }
      });
  }

  goBack(){
    this.branch = null;
  }
}
