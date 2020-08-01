import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Message } from '../Classes/message';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private api: string;
  constructor(private http: HttpClient, @Inject('messagesApi') api: string) {
    this.api = api;
  }

  getMessage(): Observable<Message[]> {
    return this.http.get<any>(
      this.api + '/all', { observe: 'response' }).pipe(
        catchError(this.handleError),
        map(response => {
          return response.body.map(message =>
            new Message(
              message.Name,
              message.Email,
              message.Message,
              message.Id))
        })
      );
  }

  postMessage(message: Message): Observable<Message> {
    return this.http.post<any>(this.api, message).pipe(
      catchError(this.handleError));
  }

  deleteMessage(messageId: number): Observable<Message> {
    return this.http.delete<any>(this.api + "/" + messageId).pipe(
      catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent)
      console.error('An error occurred:', error.error.message);
    else
      console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    return throwError('Something bad happened; Please try again later');
  }
}
