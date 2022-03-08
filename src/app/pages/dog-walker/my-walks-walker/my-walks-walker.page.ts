import { rapidwalk } from './../../../services/data.service';
import { getAuth } from 'firebase/auth';
import { DataService } from 'src/app/services/data.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-walks-walker',
  templateUrl: './my-walks-walker.page.html',
  styleUrls: ['./my-walks-walker.page.scss'],
})
export class MyWalksWalkerPage implements OnInit {

  //fields 
  
  allWalkersWalks: rapidwalk[];


  constructor(private dataService : DataService) { }

  ngOnInit() {

    let email = getAuth().currentUser.email;
    
    //let email = getAuth().currentUser.email;
    this.dataService.getAllWalkersWalks(email).subscribe(res => {
      this.allWalkersWalks = res;
    })
  }

}
