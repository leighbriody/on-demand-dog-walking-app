import { DogWalker } from './../../../services/data.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { PhotoService } from 'src/app/services/photo.service';

@Component({
  selector: 'app-sign-up-walker',
  templateUrl: './sign-up-walker.page.html',
  styleUrls: ['./sign-up-walker.page.scss' , '../auth.scss'],
})
export class SignUpWalkerPage implements OnInit {

   //here we set our variables
   showPassword:string;
   password:string;
   email:string;
   signUp:boolean;
   result:String;

   firstName:string;
   lastName:string;
   eircode:string;
   phoneNumber:string;
   addressLine:string;
   county:string;

    //photo variables
  dogProgileImagePath
  webView
  blob
  imagePath
  storageRef
  imageUrl

     // variable - default false for password
show: boolean = false;

  constructor(private auth : AuthService , private photoService: PhotoService) { }

  ngOnInit() {
  }


  
  showUserPassword() {
    this.show = !this.show;
}
deletePhoto(){
  this.imagePath = null;
}

takePicture() {
  this.photoService.addNewToGallery().then(res => {

    this.webView = res.webviewPath;
    this.blob = res.blob;
    this.imagePath = 'data:image/jpg;base64,' + this.blob;
  })
}

  SignUp(){
   
    this.auth.SignUpAsDogWalker(this.email , this.password ,this.firstName , this.lastName , this.eircode , this.phoneNumber , this.county , this.addressLine );
     //clear fields
     this.email ="";
      this.password = "";
  }

}
