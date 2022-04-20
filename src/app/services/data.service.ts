



import { getAuth, signOut } from 'firebase/auth';
import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, docData } from '@angular/fire/firestore';
import { addDoc, arrayUnion, deleteDoc, doc, getDoc, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { runInThisContext } from 'vm';
import { stat } from 'fs';
import { getDownloadURL, getStorage, ref, uploadBytes, uploadString } from "firebase/storage";

//here we ill export the DTO objects as interfaces
export interface DogOwner {
  firstName: string;
  lastname: string;
  email: string;
  city: string;
  county: string;
  eircode: string;
  phone: string;
  street: string;
  profileImageUrl:string
}

export interface geo {
  lat: number,
  lng: number
}
export interface DogWalker {
  firstName: string;
  lastName: string;
  eircode: string;
  phoneNumber: string;
  county: string;
  addressLine: string;
  username: string;
  availableCounty: string;
  profileImageUrl:string;


}

export interface Dog {
  id: string;
  name: string;
  breed: string;
  age: number;
  description: string;
  gender: string;
  height: string;
  isChecked: boolean;
  profileImageUrl: string;

}

export interface Request {
  id: string;
  email: string;
  // dogs: string[];
  dogs: Dog[]
  county: string;
  name: string;
  numberPets: number;
  durationMins: number;
  price: number;
  //status: string;
  rapidWalkId: string;
  lat: number;
  lng: number;
  profileImageUrl: string;
  //user profile image
 
}

export interface Message {

  from: string;
  text: string;
  time: number;

}



export interface walkersWhoAccepted {
  id: string;
  ownerEmail: string;
  walkerEmail: string;
  walkersFirstName: string;
  walkRequestId: string;
  numberPets: number;
  walkerCounty: string;
  durationMins: number;
  price: number;
  status: string;
  //change to date time
  date: string;
  lat: number;
  lng: number;
  profileImageUrl:string;
  dogs: Dog[];
}

export interface geopoint {
  lat: number,
  lng: number
}
export interface rapidwalk1 {
  durationMins: string
  liveWalkCords: geopoint[];
  numberPets: number;
  ownerEmail: string;
  ownerLat: number;
  ownerLng: number;
  price: number;
  timeCreated: number;
  walkDistance: number;
  walkDuration: number;
  walkRequestId: string;
  walkStatus: string;
  walkerEmail: string;
  walkerLat: number;
  walkerLng: number;
  //requestedDurationMins: number;
}

export interface LiveWalkCord {
  lat: number;
  lng: number;
}

export interface rapidwalk {
  walkDistance: number;
  timeCreated: number;
  durationMins: string;
  walkStatus: string;
  ownerEmail: string;
  walkRequestId: string;
  walkDuration: number;
  walkerLng: number;
  liveWalkCords: LiveWalkCord[];
  ownerLng: number;
  ownerLat: number;
  price: number;
  numberPets: number;
  walkerLat: number;
  walkerEmail: string;
  id: string;
  walkerProfileImageUrl:string;
  ownerProfileImageUrl:string;
  dogs:Dog[]
}

export interface ownerReview {
  reviewId: string;
  ownerEmail: string;
  reviewLeftBy: string;
  rating: number;
  reviewText: string;
}

export interface walkerReview {
  reviewId: string;
  walkerEmail: string;
  ownerEmail: string;
  rating: number;
  reviewText: string;
}

export interface pet {
  petId: string;
  petName: String;
  petImg: string
}

export interface UserPhoto {
  blob: string;
  webviewPath: string;
}

export interface ImageUrl {
  url: string;
}




@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private firestore: Firestore, private router: Router) { }

  addNewPet(newPet: Dog) {
    //add dog and store its id in a field
    const petsRef = collection(this.firestore, 'dogowners/', getAuth().currentUser.email, '/pets');
    return addDoc(petsRef, newPet).then(res => {
      const docId = res.id

      let docRef = doc(this.firestore, "dogowners", getAuth().currentUser.email, "/pets/" + docId)

      setDoc(docRef, {
        id: docId,
        age: newPet.age,
        breed: newPet.breed,
        description: newPet.description,
        height: newPet.height,
        isChecked: false,
        name: newPet.name,
        profileImageUrl: newPet.profileImageUrl

      })

    })
  }


  getAllOwnersPets() {
    console.log("get owners pets data called")
    const ownersPetsRef = collection(this.firestore, 'dogowners/' + getAuth().currentUser.email + '/pets');
    return collectionData(ownersPetsRef, { idField: 'id' }) as Observable<Dog[]>;
  }


  getLouthWalkers() {
    const dogWalkersRef = collection(this.firestore, 'dogwalkers');
    const q = query(dogWalkersRef, where("availableCountys", "array-contains", "louth"));
    return collectionData(q, { idField: 'id' }) as Observable<DogWalker[]>;
  }

  getAllLouthRequests() {
    const requestRef = collection(this.firestore, 'requests/', '/louth', '/requests');
    const q = query(requestRef, where("status", "==", "active"));
    console.log("all requests for louth called")
    return collectionData(q, { idField: 'id' }) as Observable<Request[]>;
  }

  getActiveRequestsForCounty(county: string) {
    const requestref = collection(this.firestore, 'walkrequests/');
    const q = query(requestref, where("county", "==", county));
    console.log("all requests for  county called , county :", county);
    return collectionData(q, { idField: 'id' }) as Observable<Request[]>;

  }

  getOwner(): Observable<DogOwner> {
    console.log("email ", getAuth().currentUser.email)
    var email = getAuth().currentUser.email;
    const docRef = doc(this.firestore, "dogowners/" + email);
    return docData(docRef, { idField: 'id' }) as Observable<DogOwner>;
  }

  getDogWalkerUser(): Observable<DogWalker> {
    var email = getAuth().currentUser.email;
    const docRef = doc(this.firestore, "dogwalkers/" + email);
    return docData(docRef, { idField: 'id' }) as Observable<DogWalker>;
  }

  getOwnerByEmail(email: string): Observable<DogOwner> {
    const docRef = doc(this.firestore, "dogowners/" + email);
    return docData(docRef, { idField: 'id' }) as Observable<DogOwner>;
  }


  getWalkRequestById(walkRequestId: string): Observable<Request> {
    const docRef = doc(this.firestore, "walkrequests/" + walkRequestId);
    return docData(docRef, { idField: 'id' }) as Observable<Request>;
  }

  getWalkerByEmail(email: String): Observable<DogWalker> {
    const docRef = doc(this.firestore, "dogwalkers/" + email);
    return docData(docRef, { idField: 'id' }) as Observable<DogWalker>;
  }

  getDogWalkerLoggedIn() {
    var email = getAuth().currentUser.email;
    const docRef = doc(this.firestore, "dogwalkers/" + email);
    return docData(docRef, { idField: 'id' }) as Observable<DogWalker>;
  }

  sendWalkersRequest(dogsPickedId: Dog[], lat: string, lng: string,profileImageUrl :string ,  firstName: string, county: string, email: string, numberPets: number, durationMins: number, price: number, note: string) {

    console.log("Dog owner object data side first name : ", firstName);

    const requestRef = collection(this.firestore, 'walkrequests/');
    return addDoc(requestRef, { id: requestRef.id, name: firstName, county: county, numPets: 2, durationMins: durationMins, price: price, lat: lat, lng: lng, dogs: dogsPickedId, note: note ,     profileImageUrl : profileImageUrl  }).then(res => {
      const docId = res.id
      let docRef = doc(this.firestore, "walkrequests" + "/" + docId)

      setDoc(docRef, {
        id: docId,
        name: firstName,
        county: county,
        email: email,
        numberPets: numberPets,
        durationMins: durationMins,
        price: price,
        lat: lat,
        lng: lng,
        dogs: dogsPickedId,
        note: note,
        profileImageUrl : profileImageUrl,


      })
      this.router.navigate(['/finding-walkers', docId]);
    })
  }

  acceptOwnersWalkRequest(lat: number, lng: number, request: Request, dogWalkerUser: DogWalker) {
    const ownerEmail = request.email;
    const walkerEmail = getAuth().currentUser.email;
    const walkRequestId = request.id;
    const numberPets = request.numberPets;
    const price = request.price;
    const status = "awaiting owner acceptance";
    const durationMins = request.durationMins;
    const date = "to be added";
    const walkRequestRef = collection(this.firestore, 'walkrequests/' + request.id + '/walkersWhoAccepted/');
    return addDoc(walkRequestRef, { ownerEmail: ownerEmail, walkerEmail: walkerEmail, numberPets: numberPets,   durationMins: durationMins, price, status: status, date: date, walkRequestId: request.id, lat: lat, lng: lng  , profileImageUrl:dogWalkerUser.profileImageUrl , dogs:request.dogs});
  }


  getWalkersWhoAcceptedRequest(requestId: string) {
    //this method will get ll the walkers who accepted the dog owners walk request
    const walkersWhoAcceptedRequestsRef = collection(this.firestore, 'walkrequests/' + requestId + '/walkersWhoAccepted/');
    return collectionData(walkersWhoAcceptedRequestsRef, { idField: 'id' }) as Observable<walkersWhoAccepted[]>;
  }

  createRapidWalk(walkerProfileImageUrl:string , ownerProfileImageUrl:string ,requestId: string, ownerEmail: string, walkerEmail: string, price: number, numberPets: number, walkDetails: string, walkerLat: number, walkerLng: number, ownerLat: number, ownerLng: number, durationMins: number , dogs: Dog[]) {

    const rapidWalkRef = collection(this.firestore, 'rapidwalks/');



    const timestamp = Date.now();

    let timeCreated = "change this current date time"
    //we need targetWalkDuration currentWalkDuration , currentDistance
    return addDoc(rapidWalkRef, { walkRequestId: requestId, walkerEmail: walkerEmail, ownerEmail: ownerEmail, price: price, numberPets: numberPets, timeCreated: timestamp, walkDistance: 0, walkDuration: 0, walkStatus: "awaitingStart", walkerLat: walkerLat, walkerLng: walkerLng, ownerLat: ownerLat, ownerLng: ownerLng, durationMins: durationMins  , ownerProfileImageUrl: ownerProfileImageUrl , walkerProfileImageUrl: walkerProfileImageUrl , dogs:dogs}).then(async res => {
      const docId = res.id
      console.log("adding rapid walk id ", docId, " to walkrequest id ", requestId);

      const walkRequestDocRef = doc(this.firestore, "walkrequests/" + requestId);
      await updateDoc(walkRequestDocRef, {
        rapidWalkId: docId
      });

      this.router.navigate(['/rapid-walk-owner', docId]);
    })
  }

  getRapidWalkById(rapidWalkId: string): Observable<rapidwalk> {
    const docRef = doc(this.firestore, "rapidwalks/" + rapidWalkId);
    return docData(docRef, { idField: 'id' }) as Observable<rapidwalk>;
  }

  async updateWalkersLocation(rapidwalkId: string, lat: number, lng: number) {

    //rapidwalks + rapidwalkid + 
    const docRef = doc(this.firestore, "rapidwalks/" + rapidwalkId);
    await updateDoc(docRef, {
      walkerLat: lat,
      walkerLng: lng
    })
  }

  deleteTest() {
    const docRef = doc(this.firestore, "rapidwalks/ynSWt0CIK8TQEs8OADSS");

    //marray of markers
    let markers = [
      {
        lat: 8,
        lng: 6
      },
      {
        lat: 6,
        lng: 7
      },
      {
        lat: 9,
        lng: 10
      },
    ]
    updateDoc(docRef, {
      liveMarkers: markers
    })

  }

  async updateWalkStats(rapidwalkId, time, distance) {

    const docRef = doc(this.firestore, "rapidwalks/" + rapidwalkId);
    await updateDoc(docRef, {
      walkDistance: distance,
      walkDuration: time

    })
  }

  async updateLiveWalkMarkers(rapidwalkId: string, lat, lng) {
    console.log("updating  live data markers", lat, lng);
    const docRef = doc(this.firestore, "rapidwalks/" + rapidwalkId);
    let geo = {
      lat: lat,
      lng: lng,
    }
    await updateDoc(docRef, {
      liveWalkCords: arrayUnion(geo)

    })
  }

  async endRapidWalk(rapidwalkId: string) {
    //need to get the rapid walk and update the status field to finished
    const docRef = doc(this.firestore, "rapidwalks/" + rapidwalkId);
    await updateDoc(docRef, {
      walkStatus: "finished"

    })

  }
  postReviewOnWalker(ownerEmail: string, walkerEmail: string, rating: number, reviewText: string) {
    console.log("posting review on walker ", walkerEmail, " for rating of ", rating, "with text ", reviewText);
    //add dog and store its id in a field
    const ownerReviewsRef = collection(this.firestore, 'dogwalkers/', walkerEmail, '/reviews');
    return addDoc(ownerReviewsRef, { ownerEmail: ownerEmail , walkerEmail : walkerEmail ,     reviewLeftBy: ownerEmail,  rating: rating,    reviewText: reviewText, }).then(res => {
      const docId = res.id

      let docRef = doc(this.firestore, "dogowners", walkerEmail, "/reviews/" + docId)

      setDoc(docRef, {
        id: docId,
        walkerEmail: walkerEmail,
        reviewLeftBy: ownerEmail,
        rating: rating,
        reviewText: reviewText,

      })
    })
  }

  postReviewOnOwner(walkerEmail: String, ownerEmail: string, rating: number, reviewText: string) {

    console.log("posting review on owner ", ownerEmail, " for rating of ", rating, "with text ", reviewText);

    //add dog and store its id in a field
    const ownerReviewsRef = collection(this.firestore, 'dogowners/', ownerEmail, '/reviews');
    return addDoc(ownerReviewsRef, { ownerEmail: ownerEmail , reviewLeftBy: walkerEmail,  rating: rating,   reviewText: reviewText,}).then(res => {
      const docId = res.id

      let docRef = doc(this.firestore, "dogowners", ownerEmail, "/reviews/" + docId)

      setDoc(docRef, {
        id: docId,
        ownerEmail: ownerEmail,
        reviewLeftBy: walkerEmail,
        rating: rating,
        reviewText: reviewText,

      })
    })

  }

  getAllWalkersWalks(walkerEmail: string): Observable<rapidwalk[]> {
    const requestref = collection(this.firestore, 'rapidwalks/');
    const q = query(requestref, where("walkerEmail", "==", walkerEmail));
    return collectionData(q, { idField: 'id' }) as Observable<rapidwalk[]>;
  }

  getAllOwnersWalks(ownerEmail: string): Observable<rapidwalk[]> {
    const requestref = collection(this.firestore, 'rapidwalks/');
    const q = query(requestref, where("ownerEmail", "==", ownerEmail));
    return collectionData(q, { idField: 'id' }) as Observable<rapidwalk[]>;
  }

  getAllRapidWalks() {
    console.log("get all rapid walks called")
    const ownersPetsRef = collection(this.firestore, 'rapidwalks/');
    return collectionData(ownersPetsRef, { idField: 'id' }) as Observable<rapidwalk[]>;
  }

  async removePet(userEmail , petId){
    // await deleteDoc(doc(this.firestore , 'users/' + email + '/modules/' + moduleId));

    await deleteDoc(doc (this.firestore, 'dogowner/' + userEmail + '/pets/' + petId ));
  }

  async sendMessage(rapidwalkId: string, from: string, text: string, date: Date) {


    //add dog and store its id in a field
    const messagesRef = collection(this.firestore, 'rapidwalks/', rapidwalkId, '/messages');
    return addDoc(messagesRef, { from: from, text: text, time: date.getTime() }).then(res => {
      const docId = res.id

      let docRef = doc(this.firestore, "rapidwalks/", rapidwalkId, "/messages/" + docId)
      setDoc(docRef, {
        id: docId,
        from: from,
        text: text,
        time: date.getTime(),

      })
    })





  }
  getRapidWalkMessages(rapidWalkId: string) {

    //need to get the rapid walk and update the status field to finished
    const docRef = collection(this.firestore, "rapidwalks/" + rapidWalkId + '/messages');
    return collectionData(docRef, { idField: 'id' }) as Observable<Message[]>;
  }

  addPet2(file, newPet: Dog) {
    let imageName = Date.now().toString();
    let imageUrl
    const storage = getStorage();
    const storageRef = ref(storage, imageName);
    //if file is != null 
    if(file!=null){
      uploadString(storageRef, file, 'base64').then(res => {
        imageUrl = getDownloadURL(storageRef).then((url) => {
          //now that we have the url we can add the pet
          //add dog and store its id in a field
          const petsRef = collection(this.firestore, 'dogowners/', getAuth().currentUser.email, '/pets');
          return addDoc(petsRef, newPet).then(res => {
            const docId = res.id
            let docRef = doc(this.firestore, "dogowners", getAuth().currentUser.email, "/pets/" + docId)
            setDoc(docRef, {
              id: docId,
              age: newPet.age,
              breed: newPet.breed,
              description: newPet.description,
              height: newPet.height,
              isChecked: false,
              name: newPet.name,
              profileImageUrl: url 
  
            })
  
          })
        })
      })
    }else {
      //no profile image so we just need to add the pet with default url
      const petsRef = collection(this.firestore, 'dogowners/', getAuth().currentUser.email, '/pets');
          return addDoc(petsRef, newPet).then(res => {
            const docId = res.id
            let docRef = doc(this.firestore, "dogowners", getAuth().currentUser.email, "/pets/" + docId)
            setDoc(docRef, {
              id: docId,
              age: newPet.age,
              breed: newPet.breed,
              description: newPet.description,
              height: newPet.height,
              isChecked: false,
              name: newPet.name,
              profileImageUrl: "../../../../assets/img/add-pets/dog.png"
            })

          })



      
    }
   






  }



}
