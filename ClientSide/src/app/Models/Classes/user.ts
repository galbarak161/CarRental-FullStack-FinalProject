import { Branch } from "./branch";

export class User {
    constructor(
        public Name: string,
        public UserId: string,
        public UserName: string,
        public Password: string,
        public Gender: string,
        public Email: string,
        public Image: number,
        public BirthDate?: Date,
    ) { }
}

export class UserStatus {
    constructor(
        public Status: string,
        public BranchId?: number,
    ) { }
}


export class Employee {
    constructor(
        public UserId: string,
        public BranchId: number,
        public IsAdmin: boolean,
    ) { }
}
