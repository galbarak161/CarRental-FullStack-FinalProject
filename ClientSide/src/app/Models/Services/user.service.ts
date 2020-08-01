import { Injectable, Inject, EventEmitter } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { User, UserStatus, Employee } from '../Classes/user';
import { Rental } from '../Classes/rental';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userApi: string;
  private employeeApi: string;
  private userLoggedIn: User;

  constructor(private http: HttpClient, @Inject('usersApi') userApi: string, @Inject('employeeApi') employeeApi: string) {
    this.userApi = userApi;
    this.employeeApi = employeeApi;
  }

  isLoggedin(): boolean {
    return sessionStorage['name'] != undefined;
  }

  isEmployee(): boolean {
    return sessionStorage['status'] == "Employee";
  }

  isAdmin(): boolean {
    return sessionStorage['status'] == "Admin";
  }

  logout(): void {
    sessionStorage.clear();
    this.userLoggedIn = undefined;
  }

  login(user: User): void {
    this.userLoggedIn = user;
    sessionStorage.setItem('name', user.Name);
    sessionStorage.setItem('id', user.UserId);
    let userStatus: UserStatus;

    this.getUserStatus(user.UserId).subscribe(
      status => userStatus = status,
      error => console.log(error),
      () => {
        if (userStatus.Status != undefined) {
          sessionStorage.setItem('status', userStatus.Status);
          sessionStorage.setItem('branchId', userStatus.BranchId.toString());
        }
      }
    );
  }

  getUsers(): Observable<User[]> {
    return this.http.get<any>(
      this.userApi + '/all', { observe: 'response' }).pipe(
        catchError(this.handleError),
        map(response => {
          return response.body.map(user =>
            new User(
              user.Name,
              user.UserId,
              user.UserName,
              user.Password,
              user.Gender,
              user.Email,
              user.Image,
              user.BirthDate || null
            ))
        })
      );
  }

  getEmployee(): Observable<Employee[]> {
    return this.http.get<any>(
      this.employeeApi + '/all', { observe: 'response' }).pipe(
        catchError(this.handleError),
        map(response => {
          return response.body.map(employee =>
            new Employee(
              employee.UserId,
              employee.BranchId,
              employee.IsAdmin,
            ))
        })
      );
  }

  getUserStatus(UserId: string): Observable<UserStatus> {
    return this.http.get<any>(
      this.employeeApi + '/' + UserId + '/status', { observe: 'response' }).pipe(
        catchError(this.handleError),
        map(response => {
          return response.body
        }))
  }

  get userName(): string {
    return sessionStorage.getItem('name') || this.userLoggedIn.Name;
  }

  get userId(): string {
    return sessionStorage.getItem('id') || this.userLoggedIn.UserId;
  }

  getUserRentals(UserId: string): Observable<Rental[]> {
    return this.http.get<any>(
      this.userApi + '/rentals/' + UserId, { observe: 'response' }).pipe(
        catchError(this.handleError),
        map(response => {
          return response.body.map(rent =>
            new Rental(
              rent.Id,
              rent.UserId,
              rent.CarId,
              rent.PickUpDate,
              rent.ReturnDate,
              rent.ActualReturnDate || null,
              rent.TotalDays || null,
              rent.TotalAmount || null,
              rent.Car.CarType
            )
          );
        })
      );
  }

  addUser(user: User): Observable<User> {
    return this.http.post<any>(this.userApi, user).pipe(
      catchError(this.handleError));
  }

  addEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<any>(this.employeeApi, employee).pipe(
      catchError(this.handleError));
  }

  updateEmployee(employee: Employee): Observable<Employee> {
    return this.http.put<any>(this.employeeApi + "/" + employee.UserId, employee).pipe(
      catchError(this.handleError));
  }

  deleteEmployee(userId: string): Observable<Employee> {
    return this.http.delete<any>(this.employeeApi + "/" + userId).pipe(
      catchError(this.handleError));
  }

  authenticateUser(user: object): Observable<User> {
    return this.http.post<any>(this.userApi + '/login', user).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent)
      console.error('An error occurred:', error.error.message);
    else
      console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    if (error.status == 400)
      return throwError(error.error);
    if (error.status == 404)
      return throwError('Wrong Username or password');
    return throwError('Something bad happened; Please try again later');
  }
}



