import { rapidwalk } from './../../../services/data.service';
import { getAuth } from 'firebase/auth';
import { DataService } from 'src/app/services/data.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-walks-walker',
  templateUrl: './my-walks-walker.page.html',
  styleUrls: ['./my-walks-walker.page.scss' , '../../../../tabs.scss'],
})
export class MyWalksWalkerPage implements OnInit {

  //fields 

  allWalkersWalks: rapidwalk[];


  //seconds to time details
  walkSeconds
  walkMinutes
  walkHrs

  constructor(private dataService: DataService) { }

  ngOnInit() {





    let email = getAuth().currentUser.email;

    //let email = getAuth().currentUser.email;
    this.dataService.getAllWalkersWalks(email).subscribe(res => {
      //want to see most recent at the top so reverse
      this.allWalkersWalks = res.reverse();
    })
  }

  formatToDate(timestamp: number) {

    return new Date(timestamp).toString()
  }

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
    // this.walkSeconds = seconds; 
    //this.walkMinutes = minutes;
    //this.walkHrs = hours;
  }

   format_time(s) {
     const theDate = new Date(s * 1000);
     return theDate.toUTCString();
  }



}
