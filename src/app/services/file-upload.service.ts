import { Injectable } from '@angular/core';
import {getDownloadURL, ref, Storage} from '@angular/fire/storage'


@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(
    
  ) { }

  getImage(){
   // console.log("get image test");
  
  //const storageRef = ref(this.storage , '1648750701044');

  //let url = getDownloadURL(storageRef);

  //console.log("the image url is " , url)
  }
}
