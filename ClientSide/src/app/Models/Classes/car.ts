export class Car {
    constructor(
        public CarId: number,
        public TypeId: number,
        public Mileage: number,
        public IsFix: boolean,
        public BranchId: number,
    ) { }
}

export class CarType {
    constructor(
        public Manufacturer: string,
        public Model: string,
        public DailyPrice: number,
        public DelayedPrice: number,
        public Transmission: string,
        public ProductionYear: number,
        public Image: string,
        public TypeId?: number
    ) { }
}


