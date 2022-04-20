import { AuthService } from './../../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { PhotoService } from 'src/app/services/photo.service';

//loading modal 

import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-sign-up-owner',
  templateUrl: './sign-up-owner.page.html',
  styleUrls: ['./sign-up-owner.page.scss', '../auth.scss'],
})
export class SignUpOwnerPage implements OnInit {

  //set our variables
  email: string;
  password: string;
  fName
  lName
  mobile
  address
  county
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
  constructor(private auth: AuthService, private photoService: PhotoService, public loadingController: LoadingController, private alrt: AlertController) { }

  ngOnInit() {
    this.imagePath = null;
  }

  showPassword() {
    this.show = !this.show;
  }


  async signUp() {


    let signUpSuccess = await this.auth.signUpAsOwner(this.blob, this.fName, this.lName, this.mobile, this.address, this.county, this.email, this.password);

    if(signUpSuccess){

    }else {
      const loading = await this.loadingController.create({
        spinner: null,
        duration: 7000,
        message: 'Please Wait .. ',
        translucent: true,
        cssClass: 'custom-class custom-loading'
      });
      return await loading.present();
    }
  }


  deletePhoto() {
    this.imagePath = null;
  }

  takePicture() {
    this.photoService.addNewToGallery().then(res => {

      this.webView = res.webviewPath;
      this.blob = res.blob;
      this.imagePath = 'data:image/jpg;base64,' + this.blob;
    })
  }


  async presentLoadingWithOptions() {
    const loading = await this.loadingController.create({
      spinner: null,
      duration: 5000,
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    return await loading.present();
  }

}
