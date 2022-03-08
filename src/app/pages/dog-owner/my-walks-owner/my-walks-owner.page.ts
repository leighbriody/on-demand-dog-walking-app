import { DataService } from './../../../services/data.service';
import { Component, OnInit } from '@angular/core';
import { Data } from '@angular/router';

@Component({
  selector: 'app-my-walks-owner',
  templateUrl: './my-walks-owner.page.html',
  styleUrls: ['./my-walks-owner.page.scss'],
})
export class MyWalksOwnerPage implements OnInit {

  constructor(private dataService : DataService) { }

  ngOnInit() {

    //on init here we need to get the owners walks

    //to do this we need all rapid walks where owner email : getAuth().email
   
    
  }

}
