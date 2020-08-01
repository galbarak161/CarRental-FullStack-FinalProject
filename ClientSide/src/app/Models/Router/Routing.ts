import { Routes } from "@angular/router";
import { HomeComponent } from "../../Component/Guest-root/home/home.component";
import { NotFoundComponent } from "../../Component/Guest-root/not-found/not-found.component";
import { SearchCarComponent } from "../../Component/Search-Car-root/search-car/search-car.component";
import { UserZoneComponent } from "../../Component/User-root/user-zone/user-zone.component";
import { OrderCarComponent } from "../../Component/User-root/order-car/order-car.component";
import { LastOrdersComponent } from "../../Component/User-root/last-orders/last-orders.component";
import { CarReturnComponent } from "../../Component/Employee-root/car-return/car-return.component";
import { AdminRootComponent } from "../../Component/Admin-root/admin-root/admin-root.component";

import { UserGuard } from "./Guards/user.guard";
import { CarReturnGuard } from "./Guards/car-return.guard";
import { EmployeeGuard } from "./Guards/employee.guard";
import { AdminGuard } from "./Guards/admin.guard";

export class RoutesConfig {
    static routes: Routes = [
        { path: '', redirectTo: '/home', pathMatch: 'full' },
        { path: 'home', component: HomeComponent },
        { path: 'Search-Car', component: SearchCarComponent },
        { path: 'User-Zone', component: UserZoneComponent, canActivate: [UserGuard] },
        { path: 'User-Zone/Order-Car', component: OrderCarComponent, canActivate: [UserGuard] },
        { path: 'User-Zone/User-Orders', component: LastOrdersComponent, canActivate: [UserGuard] },
        { path: 'Employee-Zone', component: CarReturnComponent, canDeactivate: [CarReturnGuard], canActivate: [EmployeeGuard] },
        { path: 'Admin-Zone', component: AdminRootComponent, canActivate: [AdminGuard] },
        { path: '**', component: NotFoundComponent }
    ];
}

