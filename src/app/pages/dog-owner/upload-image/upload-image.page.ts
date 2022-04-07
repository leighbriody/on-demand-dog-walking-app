
import { Component, OnInit } from '@angular/core';
import { UserPhoto, DataService } from 'src/app/services/data.service';
import { PhotoService } from '../../../services/photo.service';

import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FileUploadService } from 'src/app/services/file-upload.service';

import { ref, Storage, getDownloadURL } from '@angular/fire/storage';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.page.html',
  styleUrls: ['./upload-image.page.scss'],
})
export class UploadImagePage implements OnInit {

  constructor(public photoService: PhotoService , private data:DataService , private storage : Storage) { }

  public photo: UserPhoto;
  webView
  blob
  imagePath
  
  testPath

  ngOnInit() {

    //get haha from firestore get the location
    let imageLocation = 'gs://testwalkies.appspot.com/haha'
  

  }

  addPhotoToGallery() {
    this.photoService.addNewToGallery().then(res => {
      console.log("res blob ", res.blob);
      this.webView = res.webviewPath;
      this.blob = res.blob;
      this.imagePath = 'data:image/jpg;base64,' + this.blob;
    })
  }



  

  uploadImageToFirebase(){
 
  }

  async getImage(){
    
    let storageRef = ref(this.storage , "1648760664200");
    let imageUrl = await getDownloadURL(storageRef);
    this.imagePath = imageUrl;
    console.log("storage url is " , imageUrl);

  }



}
