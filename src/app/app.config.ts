import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"wordsmith-vocabulary-builder","appId":"1:401318579949:web:2680d8f4947fdd803c06e4","storageBucket":"wordsmith-vocabulary-builder.appspot.com","apiKey":"AIzaSyAW6bxP66Cg8v7JmVGxll_95sbpaNYwSSg","authDomain":"wordsmith-vocabulary-builder.firebaseapp.com","messagingSenderId":"401318579949","measurementId":"G-PX3C2ZLDCQ"}))), importProvidersFrom(provideAuth(() => getAuth())), importProvidersFrom(provideFirestore(() => getFirestore()))]
};
