import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { FirebaseApp } from '@firebase/app-types';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';

import { Geolocation } from '@ionic-native/geolocation';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { CreateCirclePage } from "../pages/create-circle/create-circle";
import { SignupPage } from "../pages/signup/signup";
import { LoginPage } from "../pages/login/login";
import { InviteMemberPage } from "../pages/invite-member/invite-member";
import { AddMemberPage } from "../pages/add-member/add-member";

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { AuthProvider } from '../providers/auth/auth';
import { DataServiceProvider } from '../providers/data-service/data-service';
// import { FirebaseApp } from '@firebase/app-types';
//   import { FirebaseService } from '@firebase/app-types/private';
export const firebaseConfig = {
	apiKey: "AIzaSyAPAqkZV7Skpo-z8SIUcOaa0sMmKgPJvyA",
    authDomain: "family-tracker-app-ce282.firebaseapp.com",
    databaseURL: "https://family-tracker-app-ce282.firebaseio.com",
    projectId: "family-tracker-app-ce282",
    storageBucket: "family-tracker-app-ce282.appspot.com",
    messagingSenderId: "690222807515"
}
@NgModule({
	declarations: [
		MyApp,
		HomePage,
		SignupPage,
		CreateCirclePage,
		LoginPage,
		InviteMemberPage,
		AddMemberPage
	],
	imports: [
		BrowserModule,
		IonicModule.forRoot(MyApp),
		AngularFireModule.initializeApp(firebaseConfig),
		AngularFireDatabaseModule,
		AngularFirestoreModule.enablePersistence(),
		AngularFireAuthModule,
		

		// AngularFirestoreModule

	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,
		HomePage,
		SignupPage,
		CreateCirclePage,
		LoginPage,
		InviteMemberPage,
		AddMemberPage

	],
	providers: [
		StatusBar,
		SplashScreen,
		NativeGeocoder,		
		AngularFireDatabase,
		Geolocation,
		{ provide: ErrorHandler, useClass: IonicErrorHandler },
		AuthProvider,
		DataServiceProvider
	]
})
export class AppModule { }
