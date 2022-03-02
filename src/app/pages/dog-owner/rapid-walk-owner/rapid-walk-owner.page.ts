import { getAuth } from '@angular/fire/auth';
import { DataService, rapidwalk, DogWalker } from 'src/app/services/data.service';
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

  constructor(private activatedRouter: ActivatedRoute, private dataService: DataService, private googleMapService: GoogleMapService , private router: Router) { }
  @ViewChild('mapel') googlemaps: google.maps.Map;

  //map variables
  zoom = 12;
  center: google.maps.LatLngLiteral
  rapidWalkId: string;
  markersOwner = []
  markersWalker = []

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
  
  //when the page first initializes
  ngOnInit() {
    //get the rapid walk id
    this.rapidWalkId = this.activatedRouter.snapshot.paramMap.get("id");


    //subscrive to rapid walk 
    this.dataService.getRapidWalkById(this.rapidWalkId).subscribe((data: rapidwalk) => {
      this.ownerLat = data.ownerLat;
      this.ownerLng = data.ownerLng;
      this.walkerLat = data.walkerLat;
      this.walkerLng = data.walkerLng;
      this.price = data.price;
      this.numDogs = data.numberPets;
      this.expectedDuration = data.durationMins;


      //checking if the walk is finished
      if(data.walkStatus == "finished"){
       
        this.walkFinished = true;
        this.walkEnded();
      }


      //get walker object by email 
      this.dataService.getWalkerByEmail(data.walkerEmail).subscribe((data: DogWalker) => {
        this.walkerEmail = data.username;
        this.walkerName = data.firstName + " " + data.lastName;

      })
      //current location next
      this.googleMapService.currentLocation.next(this.center);

      //wait for the walker to arrive at our location
      this.waitForWalkerToArrive();

      if (data.liveWalkCords == null) {  //if the live walk cords are null it means that the walk is not in progress
        this.addMarkerOwner(data.ownerLat, data.ownerLng);
        this.addMarkerWalker(data.walkerLat, data.walkerLng);
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
      }

    })




  } // ng on int

  //update the live marker
  addUpdatedLiveMarker(lat, lng) {
    this.liveWalkMarkers.push({
      location: 'home',
      position: {
        lat,
        lng,
      },
    });
    this.googleMapService.markers.next(this.liveWalkMarkers);
  }


  //add a marker for owner given lat lng
  addMarkerOwner(lat, lng): void {                     // pushing the marker we got from current location into array of markers
    this.markersOwner.push({
      location: 'home',
      position: {
        lat,
        lng,
      },
    });
    this.googleMapService.markers.next(this.markersOwner);
  }




  //add marker for walker given lat and lng
  addMarkerWalker(lat, lng): void {                     // pushing the marker we got from current location into array of markers
    this.markersWalker.push({
      location: 'home',
      position: {
        lat,
        lng,
      },
    });
    this.googleMapService.markers.next(this.markersWalker);
  }


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


  walkEnded(){
    
    //convert our seconds to hrs m s 
    this.secondsToTime(this.seconds);
  }
  //wait for walker to arrive  , every set seconds we want to get their updated co ordinates
  waitForWalkerToArrive() {
    interval(15000)
      .pipe(takeWhile(() => !this.walkInProgress))
      .subscribe(() => {
        this.dataService.getRapidWalkById(this.rapidWalkId).subscribe(res => {
          this.updateMarkerWalker(res.walkerLat, res.walkerLng);
        })

      });
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

  postReview(){
 //when a walker wishes to post a review on the owner
    //the rating is /5  
    this.dataService.postReviewOnWalker( getAuth().currentUser.email ,this.walkerEmail, this.rating , this.reviewText);
    this.router.navigate(['/my-walks-owner']);
  }
  

  skip(){
    this.router.navigate(['/my-walks-owner']);
  }

}
