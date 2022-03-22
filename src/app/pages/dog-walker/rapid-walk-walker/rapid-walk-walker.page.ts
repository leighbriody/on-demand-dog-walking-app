import { getAuth } from '@angular/fire/auth';
import { DataService, Message, rapidwalk } from 'src/app/services/data.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleMapService } from 'src/app/services/google-map.service';

import { interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { time } from 'console';

@Component({
  selector: 'app-rapid-walk-walker',
  templateUrl: './rapid-walk-walker.page.html',
  styleUrls: ['./rapid-walk-walker.page.scss'],
})
export class RapidWalkWalkerPage implements OnInit {


  constructor(private activatedRouter: ActivatedRoute, private dataservice: DataService, private googleMapService: GoogleMapService , private router: Router) { }
  @ViewChild('mapel') googlemaps: google.maps.Map;

  //map
  rapidWalkId: string;
  zoom = 14;
  center: google.maps.LatLngLiteral

  //markers array for owner and walker to show current location
  markersOwner = []
  markersWalker = []

  //array which will hold live co ordinates of walkers walk
  liveWalkMarkers = []

  //lat lng for walker and owner
  ownerLat: number;
  ownerLng: number;
  walkerLat: number;
  walkerLng: number;

  //pollyline
  polylineOptions = {
    path: [],
    strokeColor: '#32a1d0',
    strokeOpacity: 1,
    strokeWeight: 10,
  };


  //walk details
  length: number;
  seconds
  startTime;
  endTime;
  timer;
  walkInProgress: boolean = false;
  walkFinished: boolean = false;
  expectedDuration
  price
  numberPets
  walkRequestId 


  //owner card details
  ownerName
  ownerEmail
  ownerCounty

  //walk completed card 
  idOfDogsWalked: string[];
  walkSeconds
  walkMinutes
  walkHrs


  walkerEmail 
  //review info
  reviewText
  rating

  //chat box
  messages: Message[] = [];
  messageText = ""

  //on page iinit 
  ngOnInit() {

    
    this.walkerEmail = getAuth().currentUser.email;

    //get the rapid walk id
    this.rapidWalkId = this.activatedRouter.snapshot.paramMap.get("id");

    //store user email 

    //messages 
    // we want to get messages for the rapid walk and subscribe
    this.dataservice.getRapidWalkMessages(this.rapidWalkId).subscribe( res => {
      console.log("messages for rapid walk " , this.rapidWalkId , "res " , res);
      this.messages = res;
    })

    //get the rapid walk
    this.dataservice.getRapidWalkById(this.rapidWalkId).subscribe((data: rapidwalk) => {
      this.ownerLat = data.ownerLat;
      this.ownerLng = data.ownerLng;
      this.walkerLat = data.walkerLat;
      this.walkerLng = data.walkerLng;
      this.expectedDuration = data.durationMins
      this.price = data.price,
       this.numberPets = data.numberPets
      this.expectedDuration = data.durationMins
      //current location next
      this.googleMapService.currentLocation.next(this.center);

      //need to get the owner by email
      console.log("getting owner by emaill", data.ownerEmail);
      this.dataservice.getOwnerByEmail(data.ownerEmail).subscribe(res => {
        this.ownerName = res.firstName + " " + res.lastname;
        this.ownerEmail = res.email;
        this.ownerCounty = res.county;
      })

      //need to get the pets who are being walked
      //walk reqeust id 
      this.walkRequestId = data.walkRequestId;

      //if walk is not in progress we want to add walker and owners current known location
      if (!this.walkInProgress) {
        this.addMarkerOwner(data.ownerLat, data.ownerLng);
        this.addMarkerWalker(data.walkerLat, data.walkerLng);
        //add the centre to dog walkers lat and ln g
        this.center = {
          lat: data.walkerLat,
          lng: data.walkerLng,
        }
      } else {
        //the walk is in progress 

      }
    })

    //the walker must start making way to the owner
    this.StartMakinWayToOwner();
  }

  //this function will fire every x seconds while the walk is not in progress 
  //it will update the walkers current position 
  StartMakinWayToOwner() {
    interval(15000)
      .pipe(takeWhile(() => !this.walkInProgress))
      .subscribe(() => {
        navigator.geolocation.getCurrentPosition((position) => { //use geo location getting the current co ordinates and passing into current location
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          //update the walkers location
          this.updateMarkerWalker(position.coords.latitude, position.coords.longitude);

          //need to have a data service which takes the walker lat and lng and updates the firestore database
          this.dataservice.updateWalkersLocation(this.rapidWalkId, position.coords.latitude, position.coords.longitude);

        })
      });
  }

  //add a market for the owner
  addMarkerOwner(lat, lng): void {                     // pushing the marker we got from current location into array of markers
    this.markersOwner.push({
      location: 'home',
      position: {
        lat,
        lng,
      },
    });
    this.googleMapService.markers.next(this.markersOwner);
    // this.ownerLat = "";
    //this.newLong = "";
  }

  //add a marker for the walker
  addMarkerWalker(lat, lng): void {                     // pushing the marker we got from current location into array of markers
    this.markersWalker.push({
      location: 'home',
      position: {
        lat,
        lng,
      },
    });
    this.googleMapService.markers.next(this.markersWalker);
    // this.ownerLat = "";
    //this.newLong = "";
  }

  //add a live walk marker
  addLiveWalkMarker(lat, lng): void {                     // pushing the marker we got from current location into array of markers
    this.liveWalkMarkers.push({
      location: 'home',
      position: {
        lat,
        lng,
      },
    });
    this.googleMapService.markers.next(this.liveWalkMarkers);
    // this.ownerLat = "";
    //this.newLong = "";
  }


  //add a marker
  addMarker(lat, lng): void {                     // pushing the marker we got from current location into array of markers
    this.liveWalkMarkers.push({
      location: 'home',
      position: {
        lat,
        lng,
      },
    });
    this.googleMapService.markers.next(this.liveWalkMarkers);



  }

  //this method adds the lat and lng live walk cords to rapidwalk database
  addCordsToDatabase(lat, lng) {
    this.dataservice.updateLiveWalkMarkers(this.rapidWalkId, lat, lng);
  }

  //this will update the walkers marker
  updateMarkerWalker(lat, lng): void {
    this.markersWalker = [];
    console.log("markers = ", this.markersWalker);
    this.markersWalker.push({
      position: {
        lat,
        lng,
      },
    })
  }

  //when the walker clicks the start walk button this function will be called
  startWalk() {

    //walk in progress is now true and capture time 
    this.walkInProgress = true;
    this.startTime = new Date();

    //call get walk updates which will get location updates every second
    this.getWalkUpdates();

    //subscribe to the markers 
    this.googleMapService.markers.subscribe((markers) => {
      if (!markers || (Array.isArray(markers) && markers.length === 0)) {
        return;
      }

      //get bounds and set path
      const bounds = new google.maps.LatLngBounds();
      const path = [];

      //get the live walk markers and push to the path for polyline
      this.liveWalkMarkers = markers.map((marker, index) => {
        const { position, location } = marker;
        bounds.extend(new google.maps.LatLng(position));
        path.push(new google.maps.LatLng(position));
        console.log("pushing to path ", position);
        console.log("path = ", path);
        return {
          position,
          label: {
            color: 'white',
            text: `${index}`,
          },
          options: {
            icon: {

              scaledSize: { height: 35, width: 25 },
            },
          },
        };
      });
      this.polylineOptions = { ...this.polylineOptions, path };
      this.googlemaps.fitBounds(bounds);
    });
    setTimeout(() => {
      this.googleMapService.currentLocation.subscribe(
        (center) => (this.center = center)
      );
    }, 100);
  }

  //get walk updates gets the walkers location during a walk every x secodns and updates his location for owner and walker to see
  getWalkUpdates() {


    //set a timer and trigger each second
    this.timer = setInterval((function () {

      //need to get time and distance updates
      const polyLengthInMeters = google.maps.geometry.spherical.computeLength(this.polylineOptions.path);
      this.length = Math.round(polyLengthInMeters);

      //get the seconds passes

      //Duration
      this.currentTime = new Date();
      var timeDiff = this.currentTime - this.startTime; //in ms
      // strip the ms
      timeDiff /= 1000;
      var seconds = Math.round(timeDiff);
      console.log(seconds + " seconds difference");

      //set card ture and set details
      this.seconds = seconds;

      //we need to set the current seconds and distance m to the database
      this.updateWalkStats(this.seconds , this.length);




      //get the markers array
      const markers = this.googleMapService.markers.getValue();    // getting markers array

      //get current location
      navigator.geolocation.getCurrentPosition((position) => { //use geo location getting the current co ordinates and passing into current location
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }

        //add location to google maps service c
        this.googleMapService.currentLocation.next(this.center);

        //add the marker
        this.addMarker(position.coords.latitude, position.coords.longitude);

        //add this lat and lng to database
        //this is messing up
        this.addCordsToDatabase(position.coords.latitude, position.coords.longitude);
      })
    }).bind(this), 10000);// bind the object to this (this is Loop refference)


  }


  updateWalkStats(time , distance){
    console.log("upading walk time : " , time , " updating distance " , distance);
    this.dataservice.updateWalkStats( this.rapidWalkId ,time , distance);
  }
  //this function will end the wlak
  endWalk() {

    clearInterval(this.timer);
    this.timer = null;
    this.walkInProgress = false;
    this.walkFinished = true;

    //We want to display details of the walk
    //Distance 
    const polyLengthInMeters = google.maps.geometry.spherical.computeLength(this.polylineOptions.path);
    this.length = Math.round(polyLengthInMeters);
    console.log("Length of polyline in meters ", polyLengthInMeters);

    //Duration
    this.endTime = new Date();
    var timeDiff = this.endTime - this.startTime; //in ms
    // strip the ms
    timeDiff /= 1000;
    var seconds = Math.round(timeDiff);
    console.log(seconds + " seconds");

    //set card ture and set details
    this.seconds = seconds;

    this.walkFinished = true;

    //when the walk is ended what information do we need to get for the walk completed card
    
    //the owner of the dogs (dogOwner name , image)
    this.ownerName  //need this.owner image

    // pets walked , the owner of the dogs pets , name and images
    this.numberPets

    //walk details (duration finished , distance covered , price)
    this.secondsToTime(this.seconds);

    //we need tto update the database to have a flag that the walk has ended so the owner will know
    this.endRapidWalk(this.rapidWalkId);

   
   
  
  }


  sendMessage(){
    //the walker would like to send a message
    
    //from , text , time
    const d: Date = new Date();
    console.log("sendiung test " , this.messageText);
    this.dataservice.sendMessage(this.rapidWalkId ,this.walkerEmail , this.messageText , d);
  }

  postReview(){
    //when a walker wishes to post a review on the owner
    //the rating is /5  
    this.dataservice.postReviewOnOwner( getAuth().currentUser.email , this.ownerEmail ,  this.rating , this.reviewText);
    this.router.navigate(['/my-walks-walker']);
  }


  skip(){
    this.router.navigate(['/my-walks-walker']);
  }

  endRapidWalk(rapidWalkId:string){
    this.dataservice.endRapidWalk(rapidWalkId);
  }

 

   secondsToTime(secs)
{
    var hours = Math.floor(secs / (60 * 60));
    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);
    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);
    this.walkSeconds = seconds;
    this.walkMinutes = minutes;
    this.walkHrs = hours;
}
   

}
