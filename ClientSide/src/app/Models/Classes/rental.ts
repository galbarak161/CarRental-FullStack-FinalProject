import { Car, CarType } from "./car";
import { Branch } from "./branch";

export class Rental {
    constructor(
        public Id: number,
        public UserId: string,
        public CarId: number,
        public PickUpDate: Date,
        public ReturnDate: Date,
        public ActualReturnDate?: Date,
        public TotalDays?: number,
        public TotalAmount?: number,
        public CarType?: CarType,
    ) { }
}

export class RentalDates {
    constructor(
        public PickUpDate: string,
        public ReturnDate: string,
        public TotalDays?: number,
    ) { }
}

export class RentalsFacade {
    constructor(
        public UserId: string,
        public TypeId: number,
        public BranchId: number,
        public PickUpDate: string,
        public ReturnDate: string,
    ) { }
}

export class TempRental {
    constructor(
        public carType: CarType,
        public dates: RentalDates,
        public branch: Branch
    ) { }

}
