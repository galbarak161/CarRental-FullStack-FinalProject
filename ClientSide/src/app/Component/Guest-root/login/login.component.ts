import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { UserService } from '../../../Models/Services/user.service';
import { User } from '../../../Models/Classes/user';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  user: User;
  userServiceError: string = '';
  //Form
  loginForm: FormGroup;
  userName: FormControl;
  password: FormControl;

  constructor(private userService: UserService, private router: Router, private activatedRoute: ActivatedRoute) {  }

  ngOnInit() {
    this.initFormControls();
    this.loginForm = new FormGroup({
      userName: this.userName,
      password: this.password,
    });
  }

  initFormControls() {
    this.userName = new FormControl("", [
      Validators.required,
      Validators.pattern(/^\w{2,15}$/),
    ]);

    this.password = new FormControl("", [
      Validators.required,
      Validators.pattern(/^\w{2,15}$/),
    ]);
  }

  login(): void {
    this.userServiceError = '';
    if (this.loginForm.valid) {
      let userForAuth: Object = { userName: this.userName.value, password: this.password.value };
      this.userService.authenticateUser(userForAuth)
        .subscribe(
          user => {
            this.user = user;
            this.userService.login(user);
          },
          error => this.userServiceError = error,
          () => {
            this.loginForm.reset();
            document.getElementById('closeBtn').click();
            this.router.navigate(this.activatedRoute.snapshot.queryParams['goto'] || ['home']);
          }
        );
    }
    else
      alert("Something bad happened; Please try again later");
  }
}
