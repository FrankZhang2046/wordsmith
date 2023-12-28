import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { provideRouter } from '@angular/router';
import { APP_INITIALIZER } from '@angular/core';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { connectAuthEmulator } from '@angular/fire/auth';
import { connectFirestoreEmulator } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { provideAnimations } from '@angular/platform-browser/animations';
import { PpAuthLibService } from 'pp-auth-lib';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { NgxsModule } from '@ngxs/store';

export function initConfig(ppAuthService: PpAuthLibService) {
  return () => (ppAuthService.isProd = environment.production);
}

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [PpAuthLibService],
      multi: true,
    },
    provideRouter(routes),
    provideClientHydration(),
    // provideHttpClient(withFetch()),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          projectId: 'wordsmith-vocabulary-builder',
          appId: '1:401318579949:web:2680d8f4947fdd803c06e4',
          storageBucket: 'wordsmith-vocabulary-builder.appspot.com',
          apiKey: 'AIzaSyAW6bxP66Cg8v7JmVGxll_95sbpaNYwSSg',
          authDomain: 'wordsmith-vocabulary-builder.firebaseapp.com',
          messagingSenderId: '401318579949',
          measurementId: 'G-PX3C2ZLDCQ',
        })
      )
    ),
    importProvidersFrom(
      NgxsModule.forRoot([]),
      NgxsReduxDevtoolsPluginModule.forRoot(),
      provideAuth(() => {
        const auth = getAuth();
        if (!environment.production) {
          connectAuthEmulator(auth, 'http://localhost:9099', {
            disableWarnings: true,
          });
        }
        return auth;
      })
    ),
    importProvidersFrom(
      provideFirestore(() => {
        const firestore = getFirestore();
        if (!environment.production) {
          connectFirestoreEmulator(firestore, 'localhost', 8080);
        }
        return firestore;
      })
    ),
    provideAnimations(),
  ],
};
