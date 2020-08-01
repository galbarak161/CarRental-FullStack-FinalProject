import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { Branch } from '../Classes/branch';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  private api: string;
  constructor(private http: HttpClient, @Inject('branchesApi') api: string) {
    this.api = api;
  }

  get branchId(): string {
    return sessionStorage.getItem('branchId');
  }

  getAllBranches(): Observable<Branch[]> {
    return this.http.get<any>(
      this.api + '/all', { observe: 'response' }).pipe(
        catchError(this.handleError),
        map(response => {
          return response.body.map(branch =>
            new Branch(
              branch.BranchId,
              branch.Name,
              branch.Address,
              branch.Latitude,
              branch.Longitude ))
        })
      );
  }

  getBrancheName(branchId: number): Observable<Branch[]> {
    return this.http.get<any>(
      this.api + '/branch-name/' + branchId, { observe: 'response' }).pipe(
        catchError(this.handleError),
        map(response => {return response.body} )
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent)
      console.error('An error occurred:', error.error.message);
    else
      console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    return throwError('Something bad happened; Please try again later');
  }


}
