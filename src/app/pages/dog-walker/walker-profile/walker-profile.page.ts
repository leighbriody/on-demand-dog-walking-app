import { Component, OnInit } from '@angular/core';
import { DataService, DogWalker } from 'src/app/services/data.service';

@Component({
  selector: 'app-walker-profile',
  templateUrl: './walker-profile.page.html',
  styleUrls: ['./walker-profile.page.scss' ,  '../../../../tabs.scss'],
})
export class WalkerProfilePage implements OnInit {

  //fields 
  availableCounty
  user: DogWalker
  constructor(private dataservice: DataService) { }

  ngOnInit() {

    //get the current user email 
     //get the logged in walker users county which they are available to walk
     this.dataservice.getDogWalkerUser().subscribe((data: DogWalker) => {
      this.availableCounty = data.availableCounty;
      this.user = data;
   
    })



  }

}
