// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  url_ms_cinema: 'http://localhost:3333',
  api_url: 'http://127.0.0.1:8081',
  // Configuración simple de Google Maps
  googleMaps: {
    apiKey: 'AIzaSyBArsLZHUL3nXkva3Jv_c9oMXm8dXvrQBQ' // Tu API key actual
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
