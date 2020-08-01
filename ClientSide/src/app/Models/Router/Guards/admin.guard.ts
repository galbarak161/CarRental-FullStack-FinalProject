import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../../Services/user.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean> | Promise<boolean> | boolean {
    if (!this.userService.isAdmin()) {
      window.alert('Only admin may enter this zone');
      this.router.navigate(['home'], {
        queryParams: { goto: next.url }
      });
      return false;
    }
    return true;
  }
}
