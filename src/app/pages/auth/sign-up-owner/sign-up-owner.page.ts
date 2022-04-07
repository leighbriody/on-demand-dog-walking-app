import { AuthService } from './../../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { PhotoService } from 'src/app/services/photo.service';

@Component({
  selector: 'app-sign-up-owner',
  templateUrl: './sign-up-owner.page.html',
  styleUrls: ['./sign-up-owner.page.scss', '../auth.scss'],
})
export class SignUpOwnerPage implements OnInit {

  //set our variables
  email: string;
  password: string;

  //track user logged in status
  userLoggedIn: boolean;

  // variable - default false for password
  show: boolean = false;

  //photo variables
  dogProgileImagePath
  webView
  blob
  imagePath
  storageRef
  imageUrl
  

  

  //make injection as we need to access firebase auth
  constructor(private auth: AuthService, private photoService: PhotoService) { }

  ngOnInit() {
    this.imagePath = null;
  }

  showPassword() {
    this.show = !this.show;
  }


  signUp() {
    //call sign up as owner method and clear fields
    this.auth.signUpAsOwner(this.email, this.password);
    console.log("sign up as owner ts trigger", this.email, this.password);
    this.email = "";
    this.password = "";
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

}
