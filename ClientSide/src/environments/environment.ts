// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  usersApi: 'http://localhost:51774/api/users',
  employeeApi: 'http://localhost:51774/api/employees',
  messagesApi: 'http://localhost:51774/api/messages',
  carsApi: 'http://localhost:51774/api/cars',
  rentalsApi: 'http://localhost:51774/api/rentals',
  branchesApi: 'http://localhost:51774/api/branches',
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
