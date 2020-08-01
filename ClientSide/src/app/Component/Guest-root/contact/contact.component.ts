import { Component } from '@angular/core';
import { Message } from '../../../Models/Classes/message';
import { MessageService } from '../../../Models/Services/message.service';
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {

  messageObj: Message;
  messageChars: string;

  //Form
  contactForm: FormGroup;
  name: FormControl;
  email: FormControl;
  message: FormControl;

  constructor(private messageService: MessageService) { }

  ngOnInit() {
    this.initFormControls();
    this.contactForm = new FormGroup({
      name: this.name,
      email: this.email,
      message: this.message
    });
  }

  initFormControls() {
    this.name = new FormControl("", [
      Validators.required,
      Validators.maxLength(15),
      Validators.minLength(2),
      Validators.pattern(/^[a-zA-Z ]*$/)
    ]);

    this.email = new FormControl("", [
      Validators.required,
      Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
      Validators.maxLength(30)
    ]);

    this.message = new FormControl("", [
      Validators.required,
      Validators.maxLength(250)
    ]);
  }

  sendMessage(): void {
    if (this.contactForm.valid) {
      this.messageService.postMessage(new Message(
        this.name.value,
        this.email.value,
        this.message.value))
        .subscribe(
          message => {
            this.messageObj = message;
            alert("Your message has been sent");
          },
          error => alert(error)
        );
    }
    else
      alert("Oops! Try again");
  }
}
