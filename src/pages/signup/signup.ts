import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from "../../providers/auth/auth";
import { DataServiceProvider } from "../../providers/data-service/data-service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { HomePage } from "../home/home";
import { EmailValidator } from '../../validators/email';
import { LoginPage } from '../../pages/login/login';


@IonicPage()
@Component({
	selector: 'page-signup',
	templateUrl: 'signup.html',
})
export class SignupPage {
	signupForm: FormGroup;
	constructor(public dataService: DataServiceProvider, public navCtrl: NavController, public navParams: NavParams, private authService: AuthProvider, private fb: FormBuilder) {
		this.signupForm = this.fb.group({
			userName: [null, Validators.required],
			userEmail: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
			userPassword: [null, Validators.compose([Validators.minLength(6), Validators.required])]
		})
	}

	ionViewDidLoad() {
		// console.log('ionViewDidLoad SignupPage');
	}

	signup() {
		this.authService.signup(this.signupForm.value).then(success => {

			if (success) {
				this.dataService.createUserAtDb(this.signupForm.value.userName)
				this.navCtrl.push(LoginPage)
			}
		}).catch(err => {
			// console.log(err);
		})
		// this.signupForm.reset();
	}

	gotToSignin() {
		this.navCtrl.push(LoginPage)
	}

}
