import { Component } from '@angular/core';
import { User } from '../../../Models/Classes/user';
import { Router } from '@angular/router';
import { UserService } from '../../../Models/Services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  login: boolean = false;
  register: boolean = false;

  constructor(private router: Router, private userService: UserService) {
  }

  regClick(): void {
    this.login = false;
    this.register = true;
  }

  loginClick(): void {
    this.register = false;
    this.login = true;
  }

  navigateToRentCar(): void {
    this.router.navigate(['Search-Car']);
  }
}




