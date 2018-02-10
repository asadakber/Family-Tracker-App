import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseApp } from '@firebase/app-types';
import { DataServiceProvider } from "../../providers/data-service/data-service";
import { HomePage } from '../home/home';

@IonicPage()
@Component({
	selector: 'page-create-circle',
	templateUrl: 'create-circle.html',
})
export class CreateCirclePage {

	constructor(private dataService: DataServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
	}

	ionViewDidLoad() {
		// console.log('ionViewDidLoad CreateCirclePage');
	}

	createCircle(circleName) {
		this.dataService.createCircle(circleName);
		this.navCtrl.push(HomePage)
	}

	goBack() {
		this.navCtrl.push(HomePage)
	}
}
