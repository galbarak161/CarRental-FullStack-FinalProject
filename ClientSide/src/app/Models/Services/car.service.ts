import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { Car, CarType } from '../Classes/car';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  private carApi: string;
  private rentalsApi: string;

  constructor(private http: HttpClient, @Inject('carsApi') carApi: string, @Inject('rentalsApi') rentalsApi: string) {
    this.carApi = carApi;
    this.rentalsApi = rentalsApi;
  }

  getCars(): Observable<Car[]> {
    return this.http.get<any>(
      this.carApi + '/all', { observe: 'response' }).pipe(
        catchError(this.handleError),
        map(response => {
          return response.body.map(car =>
            new Car(
              car.CarId,
              car.CarType,
              car.Mileage,
              car.IsFix,
              car.BranchId, ))
        })
      );
  }

  getCarById(carId: number): Observable<Car> {
    return this.http.get<any>(
      this.carApi + '/' + carId, { observe: 'response' }).pipe(
        catchError(this.handleError),
        map(response => {
          return response.body
        }))
  }

  getCarsType(): Observable<CarType[]> {
    return this.http.get<any>(
      this.carApi + '/type', { observe: 'response' }).pipe(
        catchError(this.handleError),
        map(response => {
          return response.body.map(type =>
            new CarType(
              type.Manufacturer,
              type.Model,
              type.DailyPrice,
              type.DelayedPrice,
              type.Transmission,
              type.ProductionYear,
              type.Image,
              type.TypeId,
            ))
        })
      );
  }

  getCarTypeByCarId(carId: number): Observable<CarType> {
    return this.http.get<any>(
      this.carApi + '/type/car/' + carId, { observe: 'response' }).pipe(
        catchError(this.handleError),
        map(response => {
          return response.body
        }))
  }

  getTypeByDatesAndBranch(branchId: number, pickUpDate: string, returnDate: string): Observable<CarType[]> {
    return this.http.get<any>(
      this.rentalsApi + '/Branch/' + branchId + '/PickUpDate/' + pickUpDate + '/ReturnDate/' + returnDate, { observe: 'response' }).pipe(
        catchError(this.handleError),
        map(response => {
          return response.body.map(type =>
            new CarType(
              type.Manufacturer,
              type.Model,
              type.DailyPrice,
              type.DelayedPrice,
              type.Transmission,
              type.ProductionYear,
              type.Image,
              type.TypeId
            ))
        })
      );
  }

  getCarsFromType(typeId: number): Observable<Car[]> {
    return this.http.get<any>(
      this.carApi + '/type/' + typeId, { observe: 'response' }).pipe(
        catchError(this.handleError),
        map(response => {
          return response.body.map(car =>
            new Car(
              car.CarId,
              car.TypeId,
              car.Mileage,
              car.IsFix,
              car.BranchId,
            ))
        })
      );
  }

  updateCar(carId: number, returnCar: Car): Observable<Car> {
    return this.http.put<any>(this.carApi + '/return/' + carId, returnCar).pipe(
      catchError(this.handleError));
  }

  updateCarType(typeId: number, carType: CarType): Observable<CarType> {
    return this.http.put<any>(this.carApi + '/update/carType/' + typeId, carType).pipe(
      catchError(this.handleError));
  }

  addCar(car: Car): Observable<Car> {
    return this.http.post<any>(this.carApi + "/new/car", car).pipe(
      catchError(this.handleError));
  }

  addCarType(carType: CarType): Observable<CarType> {
    return this.http.post<any>(this.carApi + "/new/carType", carType).pipe(
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







