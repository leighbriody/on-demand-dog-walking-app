


import { getAuth } from 'firebase/auth';
import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, docData } from '@angular/fire/firestore';
import { addDoc, doc, getDoc, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { runInThisContext } from 'vm';
import { stat } from 'fs';


//here we ill export the DTO objects as interfaces
export interface DogOwner {
  firstName:string;
  lastName:string;
  email:string;
  city:string;
  county:string;
  eircode:string;
  phone:string;
  street:string;
}


export interface DogWalker {
  firstName:string;
  lastName:string;
  eircode:string;
  phoneNumber:string;
  county:string;
  addressLine:string;
  username:string;
  availableCounty:string;
  

}

export interface Dog {
  id:string;
  name:string;
  breed:string;
  age:number;
  description:string;
  gender:string;
  height:string;
  isChecked:boolean;

}

export interface Request {
  id:string;
  email:string;
  county:string;
  name:string;
  numberPets:number;
  price:number;
  status:string;
  rapidWalkId:string;
  lat:number;
  lng:number;
}



export interface walkersWhoAccepted {
  id:string;
  ownerEmail:string;
  walkerEmail:string;
  walkersFirstName:string;
  walkRequestId:string;
  numberPets:number;
  walkerCounty:string;
  price:number;
  status:string;
  //change to date time
  date:string;
  lat:number;
  lng:number;
}

export interface rapidwalk {
  ownerEmail:string;
  ownerLat:number;
  ownerLng:number;
  timeCreated:number;
  walkDistance:number;
  walkDuration:number;
  walkStatus:string;
  walkerEmail:string;
  walkerLat:number;
  walkerLng:number;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private firestore: Firestore , private router: Router) { }

  addNewPet(newPet :Dog){

    //add dog and store its id in a field
    const petsRef = collection(this.firestore,'dogowners/' ,  getAuth().currentUser.email , '/pets' );
    return addDoc(petsRef,newPet).then(res => {
      const docId = res.id

      let docRef = doc(this.firestore, "dogowners" , getAuth().currentUser.email  ,  "/pets/" + docId)

      setDoc(docRef, {
        id: docId,
        age: newPet.age,
        breed:newPet.breed,
        description:newPet.description,
        height:newPet.height,
        isChecked:false,
        name:newPet.name
        
        
    })
    })
  }


  getAllOwnersPets(){
    console.log("get owners pets data called")
    const ownersPetsRef = collection(this.firestore ,  'dogowners/' + getAuth().currentUser.email + '/pets');
    return collectionData (ownersPetsRef , {idField:'id'}) as Observable<Dog[]>;
  }

  
   getLouthWalkers(){
    const dogWalkersRef = collection(this.firestore , 'dogwalkers');
    const q = query(dogWalkersRef , where("availableCountys" , "array-contains" , "louth"));
    return collectionData (q , {idField:'id'}) as Observable<DogWalker[]>;
  }

  getAllLouthRequests(){
    const requestRef = collection(this.firestore,'requests/' , '/louth' , '/requests' );
    const q = query(requestRef , where("status" , "==" , "active"));
    console.log("all requests for louth called" )
    return collectionData (q , {idField:'id'}) as Observable<Request[]>;
  }

  getActiveRequestsForCounty(county:string){
    const requestref = collection(this.firestore,'walkrequests/' );
    const q = query(requestref , where("county" , "==" , county));
    console.log("all requests for  county called , county :" , county );
    return collectionData (q, {idField:'id'}) as Observable<Request[]>;

  }

   getOwner(): Observable<DogOwner> {
    console.log("email " , getAuth().currentUser.email )
    var email = getAuth().currentUser.email;
    const docRef = doc(this.firestore, "dogowners/" + email);   
    return docData(docRef , {idField:'id'}) as Observable<DogOwner>;
  }

  getDogWalkerUser() : Observable<DogWalker> {
    var email = getAuth().currentUser.email;
    const docRef = doc(this.firestore, "dogwalkers/" + email);
    return docData(docRef , {idField:'id'}) as Observable<DogWalker>;
  }

  getOwnerByEmail(email:String) : Observable<DogOwner> {
    const docRef = doc(this.firestore, "dogowners/" + email);
    return docData(docRef , {idField:'id'}) as Observable<DogOwner>;
  }

  getWalkerByEmail(email:String) : Observable<DogWalker> {
    const docRef = doc(this.firestore, "dogwalkers/" + email);
    return docData(docRef , {idField:'id'}) as Observable<DogWalker>;
  }

  getDogWalkerLoggedIn(){
    var email = getAuth().currentUser.email;
    const docRef = doc(this.firestore, "dogwalkers/" + email); 
    return docData(docRef , {idField:'id'}) as Observable<DogWalker>;
  }

  sendWalkersRequest(dogsPickedId : string[] , lat:string , lng:string ,dogOwner:DogOwner , numberPets:number , price:number , note:string){ 

    
    const requestRef = collection(this.firestore,'walkrequests/' );
    return addDoc(requestRef,{id: requestRef.id ,name:dogOwner.firstName , county:dogOwner.county,numPets:2,price:price , lat:lat, lng:lng , dogs:dogsPickedId , note:note}).then(res =>{
      const docId = res.id
      let docRef = doc(this.firestore, "walkrequests" + "/" + docId)

      setDoc(docRef, {
        id: docId,
        name: dogOwner.firstName,
        county:dogOwner.county,
        email:dogOwner.email,
        numberPets:numberPets,
        price:price,
        lat:lat,
        lng:lng,
        dogs:dogsPickedId,
        note:note
        
        
    })
    this.router.navigate(['/finding-walkers', docId]);
    }) 
  }

  acceptOwnersWalkRequest(lat:number , lng:number , request:Request , dogWalkerUser: DogWalker){
    const ownerEmail = request.email;
    const walkerEmail = getAuth().currentUser.email;
    const walkRequestId = request.id;
    const numberPets = request.numberPets;
    const price = request.price;
    const status = "awaiting owner acceptance";
    const date = "to be added";
    const walkRequestRef = collection(this.firestore , 'walkrequests/' + request.id + '/walkersWhoAccepted/');
    return addDoc(walkRequestRef,{ownerEmail:ownerEmail , walkerEmail:walkerEmail  ,   numberPets:numberPets,price:price , status:status , date:date , walkRequestId : request.id , lat:lat, lng:lng});
  }


  getWalkersWhoAcceptedRequest(requestId:string){
    //this method will get ll the walkers who accepted the dog owners walk request
    const walkersWhoAcceptedRequestsRef = collection(this.firestore , 'walkrequests/' + requestId + '/walkersWhoAccepted/');
    return collectionData (walkersWhoAcceptedRequestsRef , {idField:'id'}) as Observable<walkersWhoAccepted[]>;
  }

  createRapidWalk(requestId:string , ownerEmail:string , walkerEmail:string , walkDetails : string , walkerLat:number , walkerLng:number , ownerLat:number , ownerLng :number){

    const rapidWalkRef = collection(this.firestore,'rapidwalks/');

    //delete
    console.log("create data service lat and long test");
    console.log("owner " , ownerLat , " " , ownerLng);
    console.log("walker" , walkerLat , walkerLng);
    //
    console.log("walker email is " ,walkerEmail);
    const timestamp = Date.now();
    let timeCreated = "change this current date time"
    //we need targetWalkDuration currentWalkDuration , currentDistance
    return addDoc(rapidWalkRef, {walkerEmail:walkerEmail , ownerEmail:ownerEmail , timeCreated : timestamp , walkDistance : 0 , walkDuration:0 , walkStatus:"awaitingStart"  , walkerLat:walkerLat , walkerLng:walkerLng , ownerLat:ownerLat , ownerLng:ownerLng}).then(async res =>{
      const docId = res.id
      console.log("adding rapid walk id " , docId , " to walkrequest id " , requestId);

      const walkRequestDocRef = doc(this.firestore, "walkrequests/" + requestId); 
      await updateDoc(walkRequestDocRef, {
        rapidWalkId: docId
      });

      this.router.navigate(['/rapid-walk-owner', docId]);
    })
  }

  getRapidWalkById(rapidWalkId:string) : Observable<rapidwalk>{
    const docRef = doc(this.firestore, "rapidwalks/" + rapidWalkId);
    return docData(docRef , {idField:'id'}) as Observable<rapidwalk>;
  }
 
}
