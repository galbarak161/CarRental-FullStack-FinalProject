import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { UserService } from '../../../Models/Services/user.service';
import { User } from '../../../Models/Classes/user';
import { CustomValidators } from '../../../Models/Others/CustomValidators';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {

  newUser: User;
  userServiceError: string = '';
  today: Date;

  //Form
  registrationForm: FormGroup;
  name: FormControl;
  id: FormControl;
  userName: FormControl;
  password: FormControl;
  birthDate: FormControl;
  gender: FormControl;
  email: FormControl;
  image: FormControl;

  constructor(private userService: UserService) {
    this.today = new Date();
  }

  ngOnInit() {
    this.initFormControls();
    this.registrationForm = new FormGroup({
      name: this.name,
      id: this.id,
      userName: this.userName,
      password: this.password,
      birthDate: this.birthDate,
      gender: this.gender,
      email: this.email,
      image: this.image
    });
  }

  initFormControls() {
    this.id = new FormControl("", [
      Validators.required,
      Validators.pattern(/^\w{9}$/),
      Validators.pattern(/^-?(0|[1-9]\d*)?$/)
    ]);

    this.name = new FormControl("", [
      Validators.required,
      Validators.maxLength(20),
      Validators.minLength(2),
      Validators.pattern("[a-zA-Z ]*")
    ]);

    this.userName = new FormControl("", [
      Validators.required,
      Validators.pattern(/^\w{2,15}$/),
    ]);

    this.birthDate = new FormControl("", [
      CustomValidators.birthDayValidation()]);

    this.gender = new FormControl("", [
      Validators.required,
    ]);

    this.email = new FormControl("", [
      Validators.required,
      Validators.email,
      Validators.maxLength(40)
    ]);

    this.password = new FormControl("", [
      Validators.required,
      Validators.pattern(/^\w{2,15}$/),
    ]);

    this.image = new FormControl("", [
      Validators.maxLength(250),
      Validators.pattern(/^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/)
    ]);
  }

  registration(): void {
    this.userServiceError = '';
    if (this.registrationForm.valid) {
      this.userService.addUser(new User(
        this.name.value,
        this.id.value,
        this.userName.value,
        this.password.value,
        this.gender.value,
        this.email.value,
        this.image.value || "http://www.telegraph.co.uk/content/dam/men/2016/05/24/Untitled-1_trans_NvBQzQNjv4BqqVzuuqpFlyLIwiB6NTmJwfSVWeZ_vEN7c6bHu2jJnT8.jpg",
        this.birthDate.value
      ))
        .subscribe(
          newUser => {
            this.newUser = newUser;
          },
          error => this.userServiceError = error,
          () => {
            document.getElementById('closeBtn').click();
            alert("Registration Completed");
            this.registrationForm.reset();
            this.userService.login(this.newUser);
          }
        );
    }
    else
      alert("Something bad happened; Please try again later");
  }
}


