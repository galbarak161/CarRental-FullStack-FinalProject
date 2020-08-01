import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CarReturnComponent } from '../../../Component/Employee-root/car-return/car-return.component';
import { Observable } from 'rxjs';

@Injectable()
export class CarReturnGuard implements CanDeactivate<CarReturnComponent>  {
  canDeactivate(component: CarReturnComponent,
                currentRoute: ActivatedRouteSnapshot,
                currentState: RouterStateSnapshot,
                nextState?: RouterStateSnapshot): boolean |
                Observable<boolean> | Promise<boolean> {
    return component.isEmployeeFinished() || confirm('Are you sure that you want to leave this page?, all will be canceled');
  }
}


