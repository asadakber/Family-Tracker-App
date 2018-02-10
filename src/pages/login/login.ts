import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import { HomePage } from '../home/home';
import { AuthProvider } from "../../providers/auth/auth";
import { DataServiceProvider } from "../../providers/data-service/data-service";
import { EmailValidator } from '../../validators/email';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@IonicPage()
@Component({
	selector: 'page-login',
	templateUrl: 'login.html',
})
export class LoginPage {
	loginForm: FormGroup;

	constructor(private dataService: DataServiceProvider, public navCtrl: NavController, public navParams: NavParams, private authService: AuthProvider, private fb: FormBuilder) {
		this.loginForm = this.fb.group({
			userEmail: [null, Validators.compose([Validators.required, EmailValidator.isValid])],
			userPassword: [null, Validators.compose([Validators.minLength(6), Validators.required])]
		})
	}

	ionViewDidLoad() {
		// console.log('ionViewDidLoad LoginPage');
		let token = localStorage.getItem('token');
		if (token) {
			this.navCtrl.push(HomePage)
		}
	}

	gotToSignup() {
		this.navCtrl.push(SignupPage)
	}
	login() {

		this.authService.login(this.loginForm.value).then(success => {

			if (success) {
				this.authService.saveLocalData(success.uid, this.loginForm.value.userEmail);
				this.navCtrl.setRoot(HomePage)
			}

		}).catch(error => {


		})
		// this.loginForm.reset()
	}

}
