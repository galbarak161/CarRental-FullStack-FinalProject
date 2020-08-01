import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-zone',
  templateUrl: './user-zone.component.html',
  styleUrls: ['./user-zone.component.css']
})
export class UserZoneComponent {

  constructor(private router: Router) { }
}
