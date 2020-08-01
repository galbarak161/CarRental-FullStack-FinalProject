import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { environment } from './../environments/environment';

//Components
import { AppComponent } from './Component/App-root/app.component';
import { HomeComponent } from './Component/Guest-root/home/home.component';
import { RegistrationComponent } from './Component/Guest-root/registration/registration.component';
import { LoginComponent } from './Component/Guest-root/login/login.component';
import { ContactComponent } from './Component/Guest-root/contact/contact.component';
import { SearchCarComponent } from './Component/Search-Car-root/search-car/search-car.component';
import { CarTypeListComponent } from './Component/Search-Car-root/car-type-list/car-type-list.component';
import { ChooseDateComponent } from './Component/Search-Car-root/choose-date/choose-date.component';
import { ChooseBranchComponent } from './Component/Search-Car-root/choose-branch/choose-branch.component'; 
import { CarReturnComponent } from './Component/Employee-root/car-return/car-return.component';
import { UserZoneComponent } from './Component/User-root/user-zone/user-zone.component'; 
import { OrderCarComponent } from './Component/User-root/order-car/order-car.component';
import { LastOrdersComponent } from './Component/User-root/last-orders/last-orders.component';
import { AdminRootComponent } from './Component/Admin-root/admin-root/admin-root.component'; 
import { OrdersManagementComponent } from './Component/Admin-root/orders-management/orders-management.component';
import { CarsManagementComponent } from './Component/Admin-root/cars-management/cars-management.component';
import { UsersManagementComponent } from './Component/Admin-root/users-management/users-management.component';
import { ContactManagmentComponent } from './Component/Admin-root/contact-managment/contact-managment.component';
import { NotFoundComponent } from './Component/Guest-root/not-found/not-found.component';

//Services & Guard
import { UserGuard } from './Models/Router/Guards/user.guard';
import { EmployeeGuard } from './Models/Router/Guards/employee.guard';
import { AdminGuard } from './Models/Router/Guards/admin.guard';
import { CarReturnGuard } from './Models/Router/Guards/car-return.guard';
import { UserService } from './Models/Services/user.service';
import { MessageService } from './Models/Services/message.service';
import { CarService } from './Models/Services/car.service';
import { BranchService } from './Models/Services/branch.service';
import { CarTypeFilterPipe } from './Models/Others/car-type-filter.pipe';
import { DisableControlDirective } from './Models/Others/disable-control.directive';

//Plug-in
import { Routes, RouterModule } from '@angular/router'; // Angular Route
import { RoutesConfig } from './Models/Router/Routing'; // Router Config
import { HttpClientModule } from '@angular/common/http'; //HTTP Client
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; //Forms
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';//Ng Bootstrap
import { RentalService } from './Models/Services/rental.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegistrationComponent,
    LoginComponent,
    ContactComponent,

    SearchCarComponent,
    ChooseDateComponent,
    CarTypeFilterPipe,
    ChooseBranchComponent,
    CarTypeListComponent,

    CarReturnComponent,

    UserZoneComponent,
    OrderCarComponent,
    LastOrdersComponent,

    AdminRootComponent,
    OrdersManagementComponent,
    CarsManagementComponent,
    ContactManagmentComponent,
    UsersManagementComponent,

    NotFoundComponent,
    DisableControlDirective,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(RoutesConfig.routes, { useHash: true, onSameUrlNavigation: 'reload' }), //Router
    HttpClientModule, // HTTP
    ReactiveFormsModule, // Model Driven Forms
    FormsModule,  //Two Way Binding
    NgbModule.forRoot(), //Angular bootstrap
  ],
  providers: [
    UserGuard, EmployeeGuard, AdminGuard ,CarReturnGuard, // Guards
    UserService, MessageService, CarService, BranchService, RentalService, // Services
    { provide: 'usersApi', useValue: environment.usersApi }, // User Api
    { provide: 'employeeApi', useValue: environment.employeeApi }, // Employee Api
    { provide: 'messagesApi', useValue: environment.messagesApi }, // Message Api
    { provide: 'carsApi', useValue: environment.carsApi }, // Car Api
    { provide: 'rentalsApi', useValue: environment.rentalsApi }, // Rental Api
    { provide: 'branchesApi', useValue: environment.branchesApi }, // Branch Api
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


