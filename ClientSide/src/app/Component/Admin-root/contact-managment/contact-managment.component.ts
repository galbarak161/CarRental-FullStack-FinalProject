import { Component } from '@angular/core';
import { Message } from '../../../Models/Classes/message';
import { MessageService } from '../../../Models/Services/message.service';

@Component({
  selector: 'app-contact-managment',
  templateUrl: './contact-managment.component.html',
  styleUrls: ['./contact-managment.component.css']
})
export class ContactManagmentComponent {

  messages: Message[];
  constructor(private messageService: MessageService) { }

  ngOnInit() {
    this.messageService.getMessage()
      .subscribe(
        resp => this.messages = resp,
        error => alert(error),
        () => console.log(this.messages)
      );
  }

  deleteMessage(messageId: number, index: number){
    this.messageService.deleteMessage(messageId).subscribe(
      deletedMessage => this.messages.splice(index),
      error => alert(error),
      () => alert("Message deleted")
    )}
}
