import { Component } from '@angular/core';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Inbox', url: '/folder/Inbox', icon: 'mail' },
   
  ];
 
  constructor() {}
}
