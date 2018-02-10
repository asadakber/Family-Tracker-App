import { HttpClient } from '@angular/common/http';
import { Injectable, group } from '@angular/core';
import { AngularFireAuth } from "angularfire2/auth";
import { Geolocation, Geoposition } from '@ionic-native/geolocation';


declare var require: any

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");


firebase.initializeApp({
	apiKey: "AIzaSyAPAqkZV7Skpo-z8SIUcOaa0sMmKgPJvyA",
    authDomain: "family-tracker-app-ce282.firebaseapp.com",
    projectId: "family-tracker-app-ce282",
});

const db = firebase.firestore();
const userRef = db.collection('users');
const groupRef = db.collection('groups');

@Injectable()
export class DataServiceProvider {

	constructor(private afAuth: AngularFireAuth, public geolocation: Geolocation) {
		// console.log('Hello DataServiceProvider Provider');
	}

	createCircle(data) {
		let uid = this.afAuth.auth.currentUser.uid;

		groupRef.add({
			group: data,
			uid: uid
		})
			.then((docRef) => {
				groupRef.doc(docRef.id).update({ groupId: docRef.id }).then((success) => {
					this.setCurrentAdminLocation(data, docRef);
				})
			})
			.catch(function (error) {
				console.error("Error adding document: ", error);
			});
	}


	createUserAtDb(useraName) {
		let uid = this.afAuth.auth.currentUser.uid;
		userRef.doc(uid).set({ userName: useraName })
	}

	setCurrentAdminLocation(data, docRef) {

		let currentUid = localStorage.getItem('token')
		if (currentUid) {
			this.geolocation.getCurrentPosition().then((resp) => {
				// resp.coords.latitude
				// resp.coords.longitude		
				console.log(currentUid);
				
				db.collection('membersData').doc(currentUid).set({ groupId: docRef.id, uid: currentUid, Latitude: resp.coords.latitude, Longitude: resp.coords.longitude })

					.then((success => {
						// this.fetchMembers(group)

					})).catch(err => console.log(err))

			}).catch((error) => {
				// console.log('Error getting location', error);
			});
		}
	}
}
