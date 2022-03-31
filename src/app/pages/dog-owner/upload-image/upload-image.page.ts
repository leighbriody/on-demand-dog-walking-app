
import { Component, OnInit } from '@angular/core';
import { UserPhoto, DataService } from 'src/app/services/data.service';
import { PhotoService } from '../../../services/photo.service';

import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FileUploadService } from 'src/app/services/file-upload.service';



@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.page.html',
  styleUrls: ['./upload-image.page.scss'],
})
export class UploadImagePage implements OnInit {

  constructor(public photoService: PhotoService , private data:DataService, private file: FileUploadService ) { }

  public photo: UserPhoto;
  webView
  blob
  imagePath
  
  testPath

  ngOnInit() {

    //get haha from firestore get the location
    let imageLocation = 'gs://testwalkies.appspot.com/haha'
    this.imagePath = "gs://testwalkies.appspot.com/1648750701044"
    let testPath = 1648751050197

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
    //we need to take the blob and upload to firebase
    this.data.uploadImage(this.blob);
    
  }

  getImage(){
    this.file.getImage();
  }



}
