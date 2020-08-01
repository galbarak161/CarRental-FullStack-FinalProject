import { AbstractControl, ValidationErrors } from "@angular/forms";

export class CustomValidators {
    static mileageValidation(mileage: number) {
        return function (c: AbstractControl): ValidationErrors {
            const value: number = c.value;
            if (!value || value > mileage) return null;

            return {
                notValid: `The current mileage have to be more then ${mileage}`
            };
        }
    }

    static birthDayValidation() {
        return function (c: AbstractControl): ValidationErrors {
            const value: number = Date.parse(c.value);
            if (!value || value <= new Date().getTime()) return null;
            return {
                notValid: `Please insert your birthday`
            };
        }
    }

    static pickUpDateValidation() {
        return function (c: AbstractControl): ValidationErrors {
            const value: number = Date.parse(c.value);
            if (!value || value < new Date().getTime()) return null;
            return {
                notValid: `Please insert valid pickup date`
            };
        }
    }

}