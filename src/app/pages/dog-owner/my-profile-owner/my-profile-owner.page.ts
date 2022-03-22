import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-profile-owner',
  templateUrl: './my-profile-owner.page.html',
  styleUrls: ['./my-profile-owner.page.scss' ,],
})
export class MyProfileOwnerPage implements OnInit {
  @Input() mine: boolean;

  @Input() fileURL: string;
  @Input() type: 'text' | 'audio' | 'image' | 'file' = 'text';

  message : {
    from: 'billy',
    created: 'time',
    text: 'hi how are you';
  }
  messages = [
    {from: 'billy',
    time: 'time',
    text: 'hi how are you'},
    {from: 'gary',
    created: 'time',
    text: 'good you ? '},
    {from: 'gary',
    created: 'time',
    text: 'good you ? '},
    {from: 'gary',
    created: 'time',
    text: 'good you ? '},
    {from: 'gary',
    created: 'time',
    text: 'good you ? '},
    {from: 'gary',
    created: 'time',
    text: 'good you ? '},
    {from: 'gary',
    created: 'time',
    text: 'good you ? '},
    {from: 'gary',
    created: 'time',
    text: 'good you ? '},
    {from: 'gary',
    created: 'time',
    text: 'good you ? '},
    {from: 'gary',
    created: 'time',
    text: 'good you ? '},
    {from: 'gary',
    created: 'time',
    text: 'good you ? '},
    {from: 'gary',
    created: 'time',
    text: 'good you ? '},
    

  ]

  slideOpts = {
    initialSlide: 1,
    speed: 400
  };
  
  constructor() { }

  ngOnInit() {
  }

}
