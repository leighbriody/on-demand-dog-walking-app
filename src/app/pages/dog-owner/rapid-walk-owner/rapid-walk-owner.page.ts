import { LiveWalkCord } from './../../../services/data.service';
import { getAuth } from '@angular/fire/auth';
import { DataService, rapidwalk, DogWalker, Message } from 'src/app/services/data.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleMapService } from 'src/app/services/google-map.service';

import { interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-rapid-walk-owner',
  templateUrl: './rapid-walk-owner.page.html',
  styleUrls: ['./rapid-walk-owner.page.scss'],
})
export class RapidWalkOwnerPage implements OnInit {
  walkerProfileUrl: string;

  constructor(private activatedRouter: ActivatedRoute, private dataService: DataService, private googleMapService: GoogleMapService, private router: Router) { }
  @ViewChild('mapel') googlemaps: google.maps.Map;

  //map variables
  zoom = 14;
  center: google.maps.LatLngLiteral
  rapidWalkId: string;
  markersOwner = []
  markersWalker = []

  liveMarkers = [];
  //live walk view
  liveWalkMarkers = []
  //pollyline
  polylineOptions = {
    path: [],
    strokeColor: '#32a1d0',
    strokeOpacity: 1,
    strokeWeight: 10,
  };

  //owners lat
  ownerLat: number;
  ownerLng: number;

  //owners lng
  walkerLat: number;
  walkerLng: number;


  walkInProgress: boolean = false;
  walkFinished: boolean = false;
  markerCounter = 0;

  //walker card details needed
  walkerName: string;
  walkerEmail: string;
  walkerAddress: string;
  numDogs: number;
  price: number;
  expectedDuration

  seconds
  length


  //walk completed card
  walkSeconds
  walkMinutes
  walkHrs
  reviewText
  rating

  starRating 
  rapidWalk: rapidwalk
  //chat box 
  ownerEmail
  messages: Message[] = [];
  messageText = "";
  //when the page first initializes
  ngOnInit() {

    this.starRating = 5;
    //yabe centre the owner 
    
    //set owner email
    //this.ownerEmail = getAuth().currentUser.email;

    //get the rapid walk id
    this.rapidWalkId = this.activatedRouter.snapshot.paramMap.get("id");

     //messages 
    // we want to get messages for the rapid walk and subscribe
    this.dataService.getRapidWalkMessages(this.rapidWalkId).subscribe( res => {
      console.log("messages for rapid walk " , this.rapidWalkId , "res " , res);
      this.messages = res;
    })

    //subscrive to rapid walk 
    this.dataService.getRapidWalkById(this.rapidWalkId).subscribe((data: rapidwalk) => {
      this.ownerLat = data.ownerLat;
      this.ownerLng = data.ownerLng;
      this.walkerLat = data.walkerLat;
      this.walkerLng = data.walkerLng;
      this.price = data.price;
      this.numDogs = data.numberPets;
      this.expectedDuration = data.durationMins;
      this.ownerEmail = data.ownerEmail;
      this.walkerProfileUrl = data.walkerProfileImageUrl;
      //checking if the walk is finished
      if (data.walkStatus == "finished") {
        this.walkFinished = true;
        this.walkEnded();
      }

      if(this.walkInProgress != true ){
        this.updateMarkerWalker(data.walkerLat, data.walkerLng);
      }
      
 

      //get walker object by email 
      this.dataService.getWalkerByEmail(data.walkerEmail).subscribe((data: DogWalker) => {
        this.walkerEmail = data.username;
        this.walkerName = data.firstName + " " + data.lastName;

      })
      //current location next
      this.googleMapService.currentLocation.next(this.center);

 

      if (data.liveWalkCords == null) {  //if the live walk cords are null it means that the walk is not in progress
        this.addMarkerOwner(data.ownerLat, data.ownerLng);
        //this.addMarkerWalker(data.walkerLat, data.walkerLng);
        //add the centre to dog walkers lat and ln g
        this.center = {
          lat: data.walkerLat,
          lng: data.walkerLng,
        }

      } else {
        //the walker has started the walk
        this.walkInProgress = true;

        this.seconds = data.walkDuration;
        this.length = Math.round(data.walkDistance);
        //we need to get the current seconds of the walk and distance


        //subscribe to google maps markers
        this.googleMapService.markers.subscribe((markers) => {
          if (!markers || (Array.isArray(markers) && markers.length === 0)) {
            return;
          }
          const bounds = new google.maps.LatLngBounds();
          const path = [];

          this.liveWalkMarkers = markers.map((marker, index) => {
            const { position, location } = marker;
            bounds.extend(new google.maps.LatLng(position));
            path.push(new google.maps.LatLng(position));
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
          //if its the first market clear the array so we dont get last known location before walk started
          if (this.markerCounter == 0) {
            this.liveWalkMarkers = [];
          }
          this.markerCounter++;
          this.polylineOptions = { ...this.polylineOptions, path };
          this.googlemaps.fitBounds(bounds);
        });
        setTimeout(() => {
          this.googleMapService.currentLocation.subscribe(
            (center) => (this.center = center)
          );
        }, 100);

        //need to add the walkers latest known cords to our markers array
      
        this.addUpdatedLiveMarker(data.liveWalkCords[data.liveWalkCords.length - 1].lat, data.liveWalkCords[data.liveWalkCords.length - 1].lng);
        
        let newLat = data.liveWalkCords[data.liveWalkCords.length - 1].lat;
        let newLng =  data.liveWalkCords[data.liveWalkCords.length - 1].lng;
        console.log("the new lat and long value is " , newLat  , " , " , newLng)
       this.updateMarkerWalker(newLat,newLng);
       
      }

    })




  } // ng on int

  //update the live marker
  addUpdatedLiveMarker(lat, lng) {


    this.liveWalkMarkers.push({
      position:{
        lat: lat,
        lng: lng,
     },
     visible: true,
     opacity: 0.6,
     label: {
        color: '#333',
        text: 'My Label',
     },
     title: 'My Title',
        options: {
       draggable: false,
       icon: '../../../../assets/img/map/lead.png'
     }
    });
    this.googleMapService.markers.next(this.liveWalkMarkers);

  
  }

  updateMarkerWalker(lat, lng): void {
    console.log("add updated live marker for walker marker called with lat lng ," , lat , " " , lng);
    this.markersWalker = [];
    console.log("markers = ", this.markersWalker);
    this.markersWalker.push({
      position:{
        lat: lat,
        lng: lng,
     },
     visible: true,
     opacity: 0.6,
     label: {
        color: '#333',
        text: 'My Label',
     },
     title: 'My Title',
        options: {
       draggable: false,
       icon: '../../../../assets/img/map/lead.png'
     }
    })
  }

  viewOnMap(){
    this.center = {
      lat: this.walkerLat,
      lng: this.walkerLng,
    }
    
  }

  //add a marker for owner given lat lng
  addMarkerOwner(lat, lng): void {                     // pushing the marker we got from current location into array of markers
    this.markersOwner.push({
      position:{
        lat: lat,
        lng: lng,
     },
     visible: true,
     opacity: 0.6,
     label: {
        color: '#333',
        text: 'My Label',
     },
     title: 'My Title',
        options: {
       draggable: false,
       icon: '../../../../assets/img/map/paw.png'
     }
    });
    this.googleMapService.markers.next(this.markersOwner);
  }




  //add marker for walker given lat and lng
  addMarkerWalker(lat, lng): void {       
    console.log("add marker walker trigger ") ;             // pushing the marker we got from current location into array of markers
    this.markersWalker.push({
      position:{
        lat: lat,
        lng: lng,
     },
     visible: true,
     opacity: 0.6,
     label: {
        color: '#333',
        text: 'My Label',
     },
     title: 'My Title',
        options: {
       draggable: false,
       icon: '../../../../assets/img/map/lead.png'
     }
    });
    this.googleMapService.markers.next(this.markersWalker);
  }


  


  walkEnded() {

    //convert our seconds to hrs m s 
    this.secondsToTime(this.seconds);
  }

  selectStars(rating:number){
    this.starRating = rating; 
  }


  secondsToTime(secs) {
    var hours = Math.floor(secs / (60 * 60));
    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);
    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);
    this.walkSeconds = seconds;
    this.walkMinutes = minutes;
    this.walkHrs = hours;
  }

  postReview() {
    //when a walker wishes to post a review on the owner
    //the rating is /5  
    let onerEmail = getAuth().currentUser.email;
    this.dataService.postReviewOnWalker(onerEmail, this.walkerEmail, this.starRating, this.reviewText);
    this.router.navigate(['/my-walks-owner']);
  }

  
  sendMessage(){
    //the walker would like to send a message
    
    //from , text , time
   
    const d: Date = new Date();
    console.log("sendiung test " , this.messageText);
    this.dataService.sendMessage(this.rapidWalkId ,this.ownerEmail , this.messageText , d);
    this.messageText = "";
  }


  skip() {
    this.router.navigate(['/my-walks-owner']);
  }

}
