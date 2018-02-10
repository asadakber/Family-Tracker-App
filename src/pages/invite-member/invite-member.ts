import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { AddMemberPage } from "../add-member/add-member";
import { HomePage } from '../../pages/home/home';

declare var require: any

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");
const db = firebase.firestore();

declare var google;


@IonicPage()
@Component({
	selector: 'page-invite-member',
	templateUrl: 'invite-member.html',
})
export class InviteMemberPage {

	@ViewChild('map') mapElement: ElementRef;
	map: any;
	currentUid;
	userName: string;
	groupData: Object;
	constructor(public navCtrl: NavController, public geolocation: Geolocation, public navParams: NavParams) {
		this.groupData = this.navParams.get('groupData');
		this.currentUid = localStorage.getItem('token')
		this.geoLocationOfUsers(this.groupData)

	}

	ionViewDidLoad() {
		// console.log('ionViewDidLoad InviteMemberPage');
		this.fetchUser();
		this.loadMap();
	}
	loadMap() {
		this.geolocation.getCurrentPosition().then((position) => {
			let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

			let mapOptions = {
				center: latLng,
				zoom: 15,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			}

			this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
		}, (err) => {
			// console.log(err);
		}
		)
	}

	latLng = {
		Latitude: '',
		Longitude: ''
	}
	latLngArr = [];
	geoLocationOfUsers(selectedGroup) {
		let locations = [{ Latitude: '', Longitude: '' }]
		db.collection("membersData").get().then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				console.log('doc.data !!!!!',doc.data());
				console.log('selectedGroup!!!',selectedGroup);
				
				
				if (doc.data().uid == selectedGroup.uid) {
					console.log(doc.data());
					
					if (doc.data().groupId == selectedGroup.groupId) {
						for (let location in locations) {
							this.latLng.Latitude = locations[location].Latitude = doc.data().Latitude;
							this.latLng.Longitude = locations[location].Longitude = doc.data().Longitude;
						}

						let LatLngObj = {
							lat: this.latLng.Latitude,
							lng: this.latLng.Longitude
						}

						this.latLngArr.push(LatLngObj);
						this.addMarker(this.latLngArr)
					}
				}
			})
		})

	}

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

			google.maps.event.addListener(marker, 'click', ((marker) => {
				return () => {
					let geocoder = new google.maps.Geocoder();
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
			marker.map.fitBounds(bounds);
		})


	}

	fetchUser() {

		db.collection("users").get().then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				if (doc.id == this.currentUid) {
					this.userName = doc.data().userName
				}
			});
		})
	}

	inviteMember() {
		this.navCtrl.push(AddMemberPage, {
			groupData: this.groupData
		})
	}

	goback() {
		this.navCtrl.push(HomePage)
	}
}
