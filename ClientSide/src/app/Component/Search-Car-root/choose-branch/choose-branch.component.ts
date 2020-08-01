import { Component, EventEmitter, Output } from '@angular/core';
import { Branch } from '../../../Models/Classes/branch';
import { BranchService } from '../../../Models/Services/branch.service';

@Component({
  selector: 'app-choose-branch',
  templateUrl: './choose-branch.component.html',
  styleUrls: ['./choose-branch.component.css']
})
export class ChooseBranchComponent {

  @Output('choosenBranch') choosenBranch = new EventEmitter<Branch>();

  branches: Branch[];

  constructor(private branchService: BranchService) {
  }

  ngOnInit() {
    this.getAllBranches();
  }

  getAllBranches(): void {
    this.branchService.getAllBranches()
      .subscribe(
        resp => {
          this.branches = resp;
        },
        error => alert("We can't show our branches at this moment; Please come back later")
      );
  }

  onChoosenBranch(branch: Branch): void {
    this.choosenBranch.emit(branch);
  }
}
