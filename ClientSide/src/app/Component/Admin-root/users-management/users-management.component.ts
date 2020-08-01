import { Component } from '@angular/core';
import { User, Employee } from '../../../Models/Classes/user';
import { UserService } from '../../../Models/Services/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Branch } from '../../../Models/Classes/branch';
import { BranchService } from '../../../Models/Services/branch.service';

@Component({
  selector: 'app-users-management',
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.css']
})
export class UsersManagementComponent {

  users: User[];
  employees: Employee[];
  branches: Branch[];
  updateFormVisible: boolean;
  employeeToUpdate: Employee;
  userIdtoUpdate: string;

  //Form
  updateStatusForm: FormGroup;
  status: FormControl;
  branch: FormControl;

  constructor(private userService: UserService, private branchService: BranchService) {
    this.updateFormVisible = false;
  }

  ngOnInit() {
    this.initFormControls();
    this.updateStatusForm = new FormGroup({
      status: this.status,
      branch: this.branch,
    });

    this.userService.getUsers()
      .subscribe(
        resp => this.users = resp,
        error => alert(error)
      );

    this.userService.getEmployee()
      .subscribe(
        resp => this.employees = resp,
        error => alert(error)
      );

    this.branchService.getAllBranches()
      .subscribe(
        resp => {
          this.branches = resp;
        },
        error => alert("We can't show our branches at this moment; Please come back later")
      );
  }

  initFormControls() {
    this.status = new FormControl("", [Validators.required]);
    this.branch = new FormControl("", [Validators.required]);
  }

  isUserEmployeeOrAdmin(userId: string): object {
    for (let employee of this.employees) {
      if (employee.UserId == userId) {
        if (employee.IsAdmin)
          return { Status: "Admin", BranchId: employee.BranchId };
        else
          return { Status: "Employee", BranchId: employee.BranchId };
      }
    }
    return { Status: "Customer" };
  }

  toggleUpdateForm(userId: string): void {
    if (!this.userIdtoUpdate || this.userIdtoUpdate == userId) {
      this.updateFormVisible = !this.updateFormVisible;
      this.userIdtoUpdate = null;
    }
    this.status.setValue('');
    if (this.updateFormVisible) {
      this.userIdtoUpdate = userId;
      for (let employee of this.employees) {
        if (employee.UserId == userId) {
          this.employeeToUpdate = employee;
          this.branch.setValue(this.employeeToUpdate.BranchId);
          if (employee.IsAdmin)
            this.status.setValue('Admin')
          else
            this.status.setValue('Employee')
          return;
        }
      }
      this.employeeToUpdate = new Employee(userId, 0, false);
      this.status.setValue('Customer')
    }
  }

  updateUser(userId: string): void {
    let isAdmin: boolean;
    if (this.updateStatusForm.valid || this.status.value == "Customer") {
      if (confirm(`Are you sure that you want to set status of UserId ${userId} to ${this.status.value}?`)) {
        if (this.employeeToUpdate.BranchId == 0) {
          if (this.status.value != "Customer") {
            isAdmin = (this.status.value == 'Admin') ? true : false;
            this.newEmployee(new Employee(userId, this.branch.value, isAdmin));
          }
          else
            alert("This user is already customer");
        }
        else {
          if (this.status.value == "Customer")
            this.deleteEmployee(userId);
          else {
            isAdmin = (this.status.value == 'Admin') ? true : false;
            this.updateEmployee(new Employee(userId, this.branch.value, isAdmin));
          }
        }
      }
    }
    else
      alert("all fields are mandatory")
  }

  newEmployee(employee: Employee): void {
    this.userService.addEmployee(employee)
      .subscribe(
        newEmployee => this.employees.push(newEmployee),
        error => alert(error),
        () => {
          alert("User's status updated");
          this.toggleUpdateForm(employee.UserId);
        });
  }

  updateEmployee(employee: Employee): void {
    this.userService.updateEmployee(employee).subscribe(
      updatedEmployee => {
        for (let i = 0; i < this.employees.length; i++) {
          if (this.employees[i].UserId == employee.UserId)
            this.employees[i] = employee;
        }
      },
      error => alert("error"),
      () => {
        alert("User's status updated");
        this.toggleUpdateForm(employee.UserId);
      });
  }

  deleteEmployee(userId: string): void {
    this.userService.deleteEmployee(userId).subscribe(
      deletedEmployee => {
        for (let i = 0; i < this.employees.length; i++) {
          if (this.employees[i].UserId == userId)
            this.employees.splice(i);
        }
      },
      error => alert(error),
      () => {
        alert("User's status updated");
        this.toggleUpdateForm(userId);
      });
  }

}

