import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InviteMemberPage } from '../../pages/invite-member/invite-member';
import { HomePage } from '../../pages/home/home';


declare var require: any

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");
const db = firebase.firestore();

const groupRef = db.collection('groups');

@IonicPage()
@Component({
	selector: 'page-add-member',
	templateUrl: 'add-member.html',
})
export class AddMemberPage {
	randomNum: number;
	groupData: Object;
	constructor(public navCtrl: NavController, public navParams: NavParams) {
		this.groupData = this.navParams.get('groupData')
		this.generateRandomNum();

	}

	generateRandomNum() {
		db.collection("groups").get().then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				if (doc.data().groupId === this.groupData['groupId']) {
					if (!doc.data().groupCode) {
						this.randomNum = Math.floor((Math.random() * 10000) + 15000);
						groupRef.doc(this.groupData['groupId']).update({ groupCode: this.randomNum })
							.then(() => {
							}).catch(err => console.log('AN ERROR OCCURED ::: ', err));
						return;
					}

					this.randomNum = doc.data().groupCode;
				}
			});
		})

	}

	ionViewDidLoad() {
		// console.log('ionViewDidLoad AddMemberPage');
	}

	goback() {
		this.navCtrl.push(HomePage)
	}

}
