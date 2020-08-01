import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../Models/Classes/user';
import { UserService } from '../../Models/Services/user.service';
import { CarService } from '../../Models/Services/car.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RentalService } from '../../Models/Services/rental.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  closeResult: string;
  constructor(private router: Router, private rentalService: RentalService  ,private userService: UserService, private modalService: NgbModal) {}
  
  logout():void{
    this.userService.logout();
    this.router.navigate(['home']);
  }

  openLg(content):void {
    this.modalService.open(content, { size: 'lg' });
  }

  deleteTempSearch():void{
    this.rentalService.deleteTempSearch();
  }
}

