import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-owner-home',
  templateUrl: './owner-home.page.html',
  styleUrls: ['./owner-home.page.scss', '../../../../tabs.scss'],
})
export class OwnerHomePage implements OnInit {
  @ViewChild('rating') rating : any;
  
  constructor(private router: Router) { }

  stars
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };
  ngOnInit() {
    this.stars = 0;
  }

  needWalkingRedirect() {
    console.log("clicked");
    this.router.navigateByUrl('/choose-walk-details');
  }

  test() {
    console.log("test");
  }

  selectStars(number){
    this.stars = number; 
  }

}
