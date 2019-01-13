// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyDD7Lul_yWYzF1jYBSuTJUgMQn4U09UrAI',
    authDomain: 'oneworldmarathon.firebaseapp.com',
    databaseURL: 'https://oneworldmarathon.firebaseio.com',
    projectId: 'oneworldmarathon',
    storageBucket: 'oneworldmarathon.appspot.com',
    messagingSenderId: '820477595207',
  },
  signInWithEmail: 'http://localhost:4200/signInWithEmail',
}

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
