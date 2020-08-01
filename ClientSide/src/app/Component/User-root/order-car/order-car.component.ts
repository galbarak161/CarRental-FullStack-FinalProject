import { Component } from '@angular/core';
import { CarType } from '../../../Models/Classes/car';
import { RentalDates, RentalsFacade, Rental } from '../../../Models/Classes/rental';
import { Router, ActivatedRoute } from '@angular/router';
import { RentalService } from '../../../Models/Services/rental.service';
import { Branch } from '../../../Models/Classes/branch';
import { UserService } from '../../../Models/Services/user.service';
import { ViewChild } from '@angular/core';
import { } from '@types/googlemaps';

@Component({
  selector: 'app-order-car',
  templateUrl: './order-car.component.html',
  styleUrls: ['./order-car.component.css']
})

export class OrderCarComponent {

  carType: CarType;
  branch: Branch;
  dates: RentalDates;
  newRent: Rental;

  //googleMap
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  showMap: boolean = false;

  constructor(private userService: UserService, private rentalService: RentalService, private router: Router, private activated: ActivatedRoute) {
    /*activated.queryParams.subscribe(query => {
              this.typeId = query.typeId,
              this.branchId = query.branchId,
              this.pickUpDate = query.pickUpDate,
              this.returnDate = query.returnDate });
    */
  }

  ngOnInit() {
    if (this.rentalService.tempRental) {
      this.carType = this.rentalService.tempRental.carType;
      this.branch = this.rentalService.tempRental.branch;
      this.dates = this.rentalService.tempRental.dates;
    }
  }

  toggleMap() {
    if (!this.showMap) {
      var mapProp = {
        center: new google.maps.LatLng(this.branch.Latitude, this.branch.Longitude),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
      this.showMap = true;
    }
    else
      this.showMap = false;
  }

  navigateToRentCar(): void {
    this.router.navigate(['Search-Car']);
  }

  cancelRental(): void {
    if (confirm("Are you sure that you want to cancel this rental?")) {
      this.rentalService.tempRental = null;
      this.router.navigate(['Search-Car']);
    }
  }

  rentCar(): void {
    let rental = new RentalsFacade(
      this.userService.userId,
      this.carType.TypeId,
      this.branch.BranchId,
      this.dates.PickUpDate,
      this.dates.ReturnDate);
    this.rentalService.rentCar(rental).subscribe(
      newRent => {
        this.newRent = newRent;
      },
      error => alert(error),
      () => {
        alert(`congratulations! The car, ${this.newRent.CarId}, will be waiting for you at the "${this.branch.Name}" branch on your pickUp date from 10:00 AM!`);
        this.rentalService.tempRental = null;
        this.router.navigate(['User-Zone/User-Orders']);
      }

    );
    
  }


}


