import { DogOwner } from './../../../services/data.service';
import { Component, OnInit } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import { DataService, Dog } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { GoogleMapService } from 'src/app/services/google-map.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-choose-walk-details',
  templateUrl: './choose-walk-details.page.html',
  styleUrls: ['./choose-walk-details.page.scss' ,  '../../../../tabs.scss'],
})
export class ChooseWalkDetailsPage implements OnInit {

  //data fields
  dogOwnerArr: DogOwner[] = [];
  dogOnwer: DogOwner;
  ownersPets: Dog[];
  walkPrice: number;
  selectedValue: number;
  numberPetsSelected

  firstNameHere
  countyHere
  emailHere
  note

  //init to empty so we can push
  dogsSelectedForWalk: Dog[] = [];

  //options for slide cards
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  lat
  lng

  //ref to subscription so we can cancel it
  subscription: Subscription

  counter = 0;
  constructor(private dataService: DataService, private router: Router, private googleMapService: GoogleMapService) { }

  ngOnInit() {
    //on initlaise of this page we need to get the users pets 
    //store in array
    this.dataService.getAllOwnersPets().subscribe(res => {
      console.log("All pets in data res", res);
      this.ownersPets = res;
    })
    this.walkPrice = 0;
  }

  //when duration of walk is changed
  timeChanged() {
    console.log("time changed");
    this.walkPrice = (this.selectedValue / 30) * 10;
  }

  //get the current walk price based on duration
  getWalkPrice(minutes) {
    console.log("changed ", minutes);
    this.walkPrice = (this.selectedValue / 30) * 10;
  }

  makeRequestForWalkers() {
    let numPetsSelected = 0;
    for (let dog of this.ownersPets) {
      if (dog.isChecked) {
        numPetsSelected++;
        this.dogsSelectedForWalk.push(dog);
      }
    }
    //get num pets selected
    this.numberPetsSelected = numPetsSelected;

    //get walk price
    this.walkPrice = (this.selectedValue / 30) * 10;

    //get the current dog owner
    this.subscription = this.dataService.getOwner().subscribe((data: DogOwner) => {

      //build object
      let dogOnwer = {
        firstName: data.firstName,
        lastname: data.lastname,
        email: data.email,
        city: data.city,
        county: data.county,
        eircode: data.eircode,
        phone: data.phone,
        street: data.street
      }

      //push to array
      this.dogOwnerArr.push(dogOnwer);

      this.firstNameHere = data.firstName
      this.countyHere = data.county;
      this.emailHere = data.email;

      //set dog owner object outside of subscribe
      //get current logged in owners geo lat and long and add to request
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        const owner = this.dogOwnerArr.pop()
        console.log("dog owner object ", this.dogOwnerArr.pop());
        this.subscription.unsubscribe();
        this.dataService.sendWalkersRequest(this.dogsSelectedForWalk, this.lat, this.lng, owner.firstName, owner.county, owner.email, this.numberPetsSelected, this.selectedValue, this.walkPrice, this.note);
      })
    })
  }
}
