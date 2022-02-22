import { DataService, rapidwalk } from 'src/app/services/data.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GoogleMapService } from 'src/app/services/google-map.service';

@Component({
  selector: 'app-rapid-walk-owner',
  templateUrl: './rapid-walk-owner.page.html',
  styleUrls: ['./rapid-walk-owner.page.scss'],
})
export class RapidWalkOwnerPage implements OnInit {

  constructor(private activatedRouter: ActivatedRoute, private dataService: DataService, private googleMapService: GoogleMapService) { }

  //map variables
  zoom = 12;
  center: google.maps.LatLngLiteral
  rapidWalkId: string;
  markers = []

  //owners lat
  ownerLat: number;
  ownerLng: number;

  //owners lng
  walkerLat: number;
  walkerLng: number;


  ngOnInit() {
    //get the rapid walk id
    this.rapidWalkId = this.activatedRouter.snapshot.paramMap.get("id");

    //subscrive to rapid walk
    this.dataService.getRapidWalkById(this.rapidWalkId).subscribe((data: rapidwalk) => {
      this.ownerLat = data.ownerLat;
      this.ownerLng = data.ownerLng;
      this.walkerLat = data.walkerLat;
      this.walkerLng = data.walkerLng;

      //get the owners lat and long and set as centre
      this.center = {
        lat: data.ownerLat,
        lng: data.ownerLng,
      }

      //current location next
      this.googleMapService.currentLocation.next(this.center);

      //add marker
      this.addMarker(data.ownerLat, data.ownerLng);
      this.addMarker(data.walkerLat, data.walkerLng);
    })

  } // end subscribe


  //add a marker given lat lng
  addMarker(lat, lng): void {                     // pushing the marker we got from current location into array of markers
    this.markers.push({
      location: 'home',
      position: {
        lat,
        lng,
      },
    });
    this.googleMapService.markers.next(this.markers);
    // this.ownerLat = "";
    //this.newLong = "";
  }

}
