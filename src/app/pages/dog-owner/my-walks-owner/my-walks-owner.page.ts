import { DataService } from './../../../services/data.service';
import { Component, OnInit } from '@angular/core';
import { rapidwalk } from './../../../services/data.service';
import { Data } from '@angular/router';
import { getAuth } from 'firebase/auth';


@Component({
  selector: 'app-my-walks-owner',
  templateUrl: './my-walks-owner.page.html',
  styleUrls: ['./my-walks-owner.page.scss', '../../../../tabs.scss'],
})
export class MyWalksOwnerPage implements OnInit {

  constructor(private dataService: DataService) { }

  //array to hold all the walkers walks
  allOwnersWalks: rapidwalk[];

  //when page inits
  ngOnInit() {
    //get current users email and get all walks
    let email = getAuth().currentUser.email
    this.dataService.getAllOwnersWalks(email).subscribe(res => {
      //reverse it so most recent is at the top
      this.allOwnersWalks = res.reverse();
      
    })

  }

  //function to format the date time
  formatToDate(timestamp: number) {
    return new Date(timestamp).toString()
  }

  //meters to km 
  metersToKm(meters: number) {
    return (meters / 1000);
  }

  //seconds to time formatter
  secondsToTime(secs) {
    var hours = Math.floor(secs / (60 * 60));
    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);
    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);
    return hours + "hrs " + minutes + "m " + seconds + "s"
  }

  format_time(s) {
    const theDate = new Date(s * 1000);
    return theDate.toUTCString();
  }

}
