import { DataService } from './../../../services/data.service';
import { Component, OnInit } from '@angular/core';
import { PhotoService } from 'src/app/services/photo.service';
import { ref, Storage, getDownloadURL } from '@angular/fire/storage';

@Component({
  selector: 'app-add-pet',
  templateUrl: './add-pet.page.html',
  styleUrls: ['./add-pet.page.scss'],
})
export class AddPetPage implements OnInit {

  name: string;
  breed: string;
  age: number;
  description: string;
  gender: string;
  height: string;

  //photo variables
  dogProgileImagePath
  webView
  blob
  imagePath
  storageRef
  imageUrl

   resolvedFlag = true;

  constructor(private storage: Storage, private photoService: PhotoService, private data: DataService) { }

  ngOnInit() {

    this.imagePath = null;
    //if dog profile image path == null we need to set it as a default
    this.dogProgileImagePath = "https://firebasestorage.googleapis.com/v0/b/testwalkies.appspot.com/o/defaultDogProgilePic.png?alt=media&token=eda50732-4372-4d59-9690-0d9f5c2211d3";
  }



  deleteImage(){
    this.imagePath = null;
  }
 

  async addNewPet() {
  
    if(this.imagePath == null){
      this.blob = null;
    }
    this.data.addPet2(this.blob , { id: "", name: this.name, breed: this.breed, age: this.age, description: this.description, gender: this.gender, height: this.height, isChecked: false, profileImageUrl: null });

    //need to clear all fields and display a message
    this.age = null;
    this.breed = null;
    this.description = null;
    this.gender = null;
    this.height = null;
    this.name = null;

  }


 



  
  takePicture() {
    this.photoService.addNewToGallery().then(res => {

      this.webView = res.webviewPath;
      this.blob = res.blob;
      this.imagePath = 'data:image/jpg;base64,' + this.blob;
    })
  }

}
