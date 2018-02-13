// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyCfxizEs-SLnPDB3JQpwO2N36afWOI1QE0',
    authDomain: 'ng-fitness-tracker-abhi.firebaseapp.com',
    databaseURL: 'https://ng-fitness-tracker-abhi.firebaseio.com',
    projectId: 'ng-fitness-tracker-abhi',
    storageBucket: 'ng-fitness-tracker-abhi.appspot.com',
    messagingSenderId: '787435117883'
  }
};
