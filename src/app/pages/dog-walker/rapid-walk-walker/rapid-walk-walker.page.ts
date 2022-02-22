import { DataService, rapidwalk } from 'src/app/services/data.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GoogleMapService } from 'src/app/services/google-map.service';

@Component({
  selector: 'app-rapid-walk-walker',
  templateUrl: './rapid-walk-walker.page.html',
  styleUrls: ['./rapid-walk-walker.page.scss'],
})
export class RapidWalkWalkerPage implements OnInit {

  constructor(private activatedRouter: ActivatedRoute, private dataservice: DataService, private googleMapService: GoogleMapService) { }

  //map
  rapidWalkId: string;
  zoom = 12;
  center: google.maps.LatLngLiteral
  markers = []

  ownerLat: number;
  ownerLng: number;

  walkerLat: number;
  walkerLng: number;

  walkInProgress : boolean = false;
  ngOnInit() {
    //get the rapid walk id
    this.rapidWalkId = this.activatedRouter.snapshot.paramMap.get("id");

    //get the rapid walk
    this.dataservice.getRapidWalkById(this.rapidWalkId).subscribe((data: rapidwalk) => {
      this.ownerLat = data.ownerLat;
      this.ownerLng = data.ownerLng;
      this.walkerLat = data.walkerLat;
      this.walkerLng = data.walkerLng;

      //add the centre to dog walkers lat and ln g
      this.center = {
        lat: data.walkerLat,
        lng: data.walkerLng,
      }

      //current location next
      this.googleMapService.currentLocation.next(this.center);

      //add marker
      this.addMarker(data.ownerLat, data.ownerLng);
      this.addMarker(data.walkerLat, data.walkerLng);
    })
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
    // this.ownerLat = "";
    //this.newLong = "";
  }

}
