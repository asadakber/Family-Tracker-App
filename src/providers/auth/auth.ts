import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class AuthProvider {

	constructor(public afAuth: AngularFireAuth) {
		// console.log('Hello AuthProvider Provider');
	}

	signup(signupData) {
		return this.afAuth.auth.createUserWithEmailAndPassword(signupData.userEmail, signupData.userPassword)

	}

	saveLocalData(currentUid, userName) {
		localStorage.setItem('token', currentUid);
		localStorage.setItem('userName', userName);

	}

	login(loginData) {
		return this.afAuth.auth.signInWithEmailAndPassword(loginData.userEmail, loginData.userPassword)
	}

	logout() {
		this.afAuth.auth.signOut();
	}

}
