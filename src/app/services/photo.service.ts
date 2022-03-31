import { Injectable } from '@angular/core';

import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { UserPhoto } from './data.service';
//import { Storage } from '@capacitor/storage';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  constructor() { }

  public photos: UserPhoto[] = [];

   async addNewToGallery() :Promise<UserPhoto> {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      quality: 100
    });


    let UserPhoto = {
      blob: capturedPhoto.base64String,
      webviewPath: capturedPhoto.webPath
    }
  
    return UserPhoto;
  }

}


