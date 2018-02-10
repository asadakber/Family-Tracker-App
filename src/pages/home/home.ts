import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, MenuController, NavParams } from 'ionic-angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { AngularFireAuth } from "angularfire2/auth";
import { AlertController, Platform } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { CreateCirclePage } from "../create-circle/create-circle";
import { LoginPage } from "../login/login";
import { InviteMemberPage } from "../invite-member/invite-member";
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import { asNativeElements } from '@angular/core/src/debug/debug_node';

declare var require: any
declare var geocoder: any;
const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");
const db = firebase.firestore();

declare var google;
@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {
	currentUid: string;
	@ViewChild('map') mapElement: ElementRef;
	map: any;
	isShowMap: boolean = true;
	isGroupsList: boolean = true;
	isBackIcon: boolean = false;
	isMenu: boolean = true;
	watch;


	constructor(private authProvider: AuthProvider,private platform: Platform, private nativeGeocoder: NativeGeocoder, public alertCtrl: AlertController, private navParams: NavParams, public afAuth: AngularFireAuth, public navCtrl: NavController, menu: MenuController, public geolocation: Geolocation) {
		menu.enable(true);
		this.fetchGroups();

	}


	ionViewDidLoad() {
		this.loadMap();
	}

	othersGroupArray = [];
	adminGroupArray = [];
	fetchGroups() {
		this.currentUid = localStorage.getItem('token');
		setTimeout(() => {

			db.collection("groups").get().then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					if (doc.data().uid == this.currentUid) {
						this.adminGroupArray.push(doc.data())
					}
					else {
						this.othersGroupArray.push(doc.data())
					}
				});
			})
		}, 2000);
	}

	lat;
	lng;
	latLngObj = { lat: '', lng: '' }
	latLngArr = [];
	addMarker(latLng) {
		//create empty LatLngBounds object
		var bounds = new google.maps.LatLngBounds();
		var infowindow = new google.maps.InfoWindow();

		latLng.forEach((param) => {

			let lat = parseFloat(param.lat);
			let lng = parseFloat(param.lng);

			let Obj = {
				lat: lat,
				lng: lng
			}
			let marker = new google.maps.Marker({
				map: this.map,
				animation: google.maps.Animation.DROP,
				position: new google.maps.LatLng(Obj.lat, Obj.lng)
			});
			//extend the bounds to include each marker's position
			bounds.extend(marker.position);
			// to stop watching
			this.watch.unsubscribe();
			google.maps.event.addListener(marker, 'click', ((marker) => {
				return () => {
					var geocoder = new google.maps.Geocoder();
					geocoder.geocode({ 'location': Obj }, (results, status) => {
						if (status === 'OK') {
							if (results[0]) {
								let data = results[0]
								infowindow.setContent(data.formatted_address);
								infowindow.open(marker.map, marker);

							}
						}
					})
				}
			})(marker));

			//now fit the map to the newly inclusive bounds
			if (marker.map.fitBounds(bounds) !== undefined) {

				marker.map.fitBounds(bounds);

			}
		})
	}


	loadMap() {
		this.geolocation.getCurrentPosition().then((position) => {

			let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

			let mapOptions = {
				center: latLng,
				zoom: 15,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			}
			if (this.mapElement && this.mapElement.nativeElement !== undefined) {
				this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
			}
			let marker = new google.maps.Marker({
				position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
				map: this.map
			});
		}, (err) => {
			// console.log(err);
		})
	}

	createCircle() {
		this.navCtrl.push(CreateCirclePage)

	}
	groupSelected(group) {
		this.navCtrl.push(InviteMemberPage, {
			groupData: group
		})
	}
	othersGroupSelected(group) {
		let prompt = this.alertCtrl.create({
			title: 'Group Code',
			message: "Enter a code of the group you want to join",
			inputs: [
				{
					name: 'code',
					placeholder: 'group code',

					// type : 'password'
				},
			],
			buttons: [
				{
					text: 'Cancel',
					handler: data => {
					}
				},
				{
					text: 'Save',
					handler: data => {
						if (data.code == group.groupCode) {
							alert('password is matched')
							this.geolocationOfUsers(group);
							this.isGroupsList = false;
							this.isMenu = false;
							this.isShowMap = true;
							this.isBackIcon = true;
						}
						else {
							alert("your password isn't matched")
						}
					}
				}
			]
		});
		prompt.present();
	}
	goBack() {
		this.isGroupsList = true;
		this.isMenu = true;
		this.isBackIcon = false;
	}

	geolocationOfUsers(group) {
		this.watch = this.geolocation.watchPosition()
			.subscribe((data) => {
				let uid = this.afAuth.auth.currentUser.uid;
				db.collection("groupMembers").doc(group.groupId).set({ memberUid: uid }).then((success) => {
					db.collection('membersData').doc(uid).set({ groupId : group.groupId,uid: group.uid, Latitude: data.coords.latitude, Longitude: data.coords.longitude })

						.then((success => {
							this.fetchMembers(group)
						})).catch(err =>
							console.log(err))
				}, (err) => {
					// console.log(err);

				})
			})

	}
	latLng;

	latLng2 = {
		Latitude: '',
		Longitude: ''
	}
	latLngArr2 = [];
	fetchMembers(group) {
		let locations = [{ Latitude: '', Longitude: '' }]
		db.collection("membersData").get().then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				if (doc.data().uid == group.uid) {
					for (let location in locations) {
						this.latLng2.Latitude = locations[location].Latitude = doc.data().Latitude;
						this.latLng2.Longitude = locations[location].Longitude = doc.data().Longitude;
					}
					let LatLngObj = {
						lat: this.latLng2.Latitude,
						lng: this.latLng2.Longitude
					}
					this.latLngArr2.push(LatLngObj);
					this.addMarker(this.latLngArr2);

				}
			});
		})
	}

	signout() {
		this.authProvider.logout();
		localStorage.removeItem('token');
		localStorage.removeItem('userName');
		// this.navCtrl.push(LoginPage);
		this.navCtrl.pop();
	}

}
