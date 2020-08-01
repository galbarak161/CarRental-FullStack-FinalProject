import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { RentalsFacade, Rental, TempRental } from '../Classes/rental';

@Injectable({
  providedIn: 'root'
})
export class RentalService {

  private rentalsApi: string;

  constructor(private http: HttpClient, @Inject('rentalsApi') rentalsApi: string) {
    this.rentalsApi = rentalsApi;
    this._temporaryCarsSearch = [];
  }

  getRentals(): Observable<Rental[]> {
    return this.http.get<any>(
      this.rentalsApi + '/all', { observe: 'response' }).pipe(
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
          )
        }
        ));
  }

  getRentalByCarIdAndPickUpDate(carId: number, pickUpDate: Date): Observable<Rental> {
    return this.http.get<any>(
      this.rentalsApi + '/CarId/' + carId + '/PickUpDate/' + pickUpDate, { observe: 'response' }).pipe(
        catchError(this.handleError),
        map(response => {
          return response.body
        }))
  }

  rentCar(rental: RentalsFacade): Observable<Rental> {
    return this.http.post<any>(this.rentalsApi + "/new", rental).pipe(
      catchError(this.handleError));
  }

  deleteRental(rentId: number): Observable<Rental> {
    return this.http.delete<any>(this.rentalsApi + '/delete/rentalId/' + rentId).pipe(
      catchError(this.handleError));
  }

  updateRental(rentalId: number, returnRent: Rental): Observable<Rental> {
    return this.http.put<any>(this.rentalsApi + '/return/' + rentalId, returnRent).pipe(
      catchError(this.handleError));
  }

  saveTempRental(tempRental: TempRental): void {
    let lastSearch: number = this.temporaryCarsSearch.length;

    for (let type of this.temporaryCarsSearch) {
      if (type.carType.TypeId == tempRental.carType.TypeId
        && type.dates.PickUpDate == tempRental.dates.PickUpDate
        && type.dates.ReturnDate == tempRental.dates.ReturnDate
        && type.branch.BranchId == tempRental.branch.BranchId)
        return;
    }
    lastSearch++;
    localStorage.setItem('search-' + lastSearch, JSON.stringify(tempRental));
  }

  deleteTempSearch(): void {
    localStorage.clear();
    this._temporaryCarsSearch = [];
  }

  private _temporaryCarsSearch: TempRental[];
  public get temporaryCarsSearch(): TempRental[] {
    let index: number = 1;
    while (localStorage.getItem('search-' + index)) {
      this._temporaryCarsSearch[index - 1] = JSON.parse(localStorage.getItem('search-' + index));
      index++;
    }
    return this._temporaryCarsSearch;
  }
  public set temporaryCarsSearch(temporaryCarsSearch: TempRental[]) {
    this._temporaryCarsSearch = temporaryCarsSearch;
  }

  private _tempRental: any;
  public get tempRental(): any {
    return this._tempRental;
  }
  public set tempRental(tempRental: any) {
    this._tempRental = tempRental;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent)
      console.error('An error occurred:', error.error.message);
    else
      console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    return throwError('Something bad happened; Please try again later');
  }
}
