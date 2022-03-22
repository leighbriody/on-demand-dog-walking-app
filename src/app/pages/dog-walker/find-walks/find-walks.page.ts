
import { element } from 'protractor';
import { DataService, DogWalker } from 'src/app/services/data.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Request } from 'src/app/services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleMapService } from 'src/app/services/google-map.service';
import { TouchSequence } from 'selenium-webdriver';

@Component({
  selector: 'app-find-walks',
  templateUrl: './find-walks.page.html',
  styleUrls: ['./find-walks.page.scss', '../../../../tabs.scss'],
})
export class FindWalksPage implements OnInit {

  countys: []
  // requests: Request[];
  requests: Request[];
  dogWalkerUser: DogWalker;

  acceptBtns: string[] = [];
  testCountys
  availableCounty

  acceptBtnText = "Accept"

  slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  //google map settings
  zoom = 14;
  markers = []
  center: google.maps.LatLngLiteral
  options: google.maps.MapOptions = {
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    mapTypeId: 'hybrid',
    maxZoom: 15,
    minZoom: 8,
  }

  map: google.maps.Map;
  newLat: any;
  newLong: any;
  length: number;

  constructor(private dataservice: DataService, private router: Router, private googleMapService: GoogleMapService) { }
  @ViewChild('mapel') googlemaps: google.maps.Map;
  ngOnInit() {
    //get the logged in walker users county which they are available to walk
    this.dataservice.getDogWalkerUser().subscribe((data: DogWalker) => {
      this.availableCounty = data.availableCounty;
      this.dataservice.getActiveRequestsForCounty(this.availableCounty).subscribe(res => {
        this.requests = res;
      })

      //want to loop trough all requests and create an array of strings for accepted / decline
      for (let i = 0; i < this.requests.length; i++) {
        this.acceptBtns[i] = "Accept";
      }
    })

    const markers = this.googleMapService.markers.getValue();

    //get geo location
    navigator.geolocation.getCurrentPosition((position) => { //use geo location getting the current co ordinates and passing into current location
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }

      //add marker
      this.googleMapService.currentLocation.next(this.center);
      this.addMarker(position.coords.latitude, position.coords.longitude);
    })

  }

  //accept the walkers request
  acceptRequest(request: Request, int: number) {

    //need to get the current walkers long and lat and add to accept request
    this.acceptBtns[int] = "Waiting"
    //then accept the walk request
    navigator.geolocation.getCurrentPosition((position) => { //use geo location getting the current co ordinates and passing into current location
      this.googleMapService.currentLocation.next(this.center);
      this.dataservice.acceptOwnersWalkRequest(position.coords.latitude, position.coords.longitude, request, this.dogWalkerUser);
    })
  }
  getAvailableWalks() {
  }

  //join the rapid walk 
  joinRapidWalk(rapidWalkId: string) {
    this.router.navigate(['/rapid-walk-walker', rapidWalkId]);
  }

  viewOwnerOnMap(request: Request) {
    this.center = {
      lat: request.lat,
      lng: request.lng,
    }

    this.addMarker(request.lat, request.lng);
    this.googleMapService.currentLocation.next(this.center);

  }


  addMarker(lat, lng): void {                     // pushing the marker we got from current location into array of markers
    this.markers.push({
      location: 'home',
      position: {
        lat,
        lng,
      },
    });
    this.googleMapService.markers.next(this.markers);
    this.newLat = "";
    this.newLong = "";
  }


}

