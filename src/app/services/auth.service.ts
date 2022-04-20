import { DogWalker } from './data.service';
import { collection, doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Router } from '@angular/router';
import { getDownloadURL, getStorage, ref, uploadBytes, uploadString } from "firebase/storage";
import { count } from 'console';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //store our auth in a varibale
  auth = getAuth();

  constructor(private firestore: Firestore, private router: Router) {

  }

  signUpAsOwner(file , fName:string , lName:string , mobile:string , address:string , county:string , email: string, password: string): boolean {
    //create user with credentials

    let signUpSuccess = false;
   
    //as we are using image we need ref to storage
     //uploading an images profile NEED REF TO STORAGE
     let imageName = Date.now().toString();
     let imageUrl
     const storage = getStorage();
     const storageRef = ref(storage, imageName);

     console.log("sign up as owner blob file " , file)
     if(file!= null){
       //default image path
       uploadString(storageRef , file , 'base64').then(res => {
        imageUrl = getDownloadURL(storageRef).then((url)=>{
         createUserWithEmailAndPassword(this.auth, email, password).then(cred => {
           const usersRef = collection(this.firestore, 'dogowners');
           setDoc(doc(this.firestore, "dogowners", email), {
             firstName:fName,
             lastname:lName,
             mobile:mobile,
             address:address,
             county:county,
             email:email,
             username: email,
             profileImageUrl:url
           });

           signInWithEmailAndPassword(this.auth, email, password).then(cred => {
            //clear fields and re direc
            this.router.navigateByUrl('/owner-home');
            signUpSuccess = true;
          })


         }).catch(async (error) => {
           //if the email is already in use , check if its as dog walker
           if (error.code === "auth/email-already-in-use") {
             const docRef = doc(this.firestore, "dogowners", email);
             const docSnap = await getDoc(docRef);
             if (docSnap.exists()) {
             } else {
               // doc.data() will be undefined in this case so they do not exists as a dog owner
               //therefore we can go ahead and create them as one
               console.log("User already existed as a dog walker but now they are an owner aswel")
               setDoc(doc(this.firestore, "dogowners", email), {
                firstName:fName,
                lastname:lName,
                mobile:mobile,
                address:address,
                county:county,
                email:email,
                username: email,
                profileImageUrl:url
               });
               signInWithEmailAndPassword(this.auth, email, password).then(cred => {
                //clear fields and re direc
                this.router.navigateByUrl('/owner-home');
                signUpSuccess = true;
              })
             }
           }
         });
        })
      })
     }else {
      createUserWithEmailAndPassword(this.auth, email, password).then(cred => {
        const usersRef = collection(this.firestore, 'dogowners');
        setDoc(doc(this.firestore, "dogowners", email), {
          firstName:fName,
          lastname:lName,
          mobile:mobile,
          address:address,
          county:county,
          email:email,
          username: email,
          profileImageUrl:"../../../../assets/img/default-img/default-user.png"
        });

        signInWithEmailAndPassword(this.auth, email, password).then(cred => {
          //clear fields and re direc
          this.router.navigateByUrl('/owner-home');
          signUpSuccess = true;
        })

      }).catch(async (error) => {
        //if the email is already in use , check if its as dog walker
        if (error.code === "auth/email-already-in-use") {
          const docRef = doc(this.firestore, "dogowners", email);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
          } else {
            // doc.data() will be undefined in this case so they do not exists as a dog owner
            //therefore we can go ahead and create them as one
            console.log("User already existed as a dog walker but now they are an owner aswel")
            setDoc(doc(this.firestore, "dogowners", email), {
              firstName:fName,
              lastname:lName,
              mobile:mobile,
              address:address,
              county:county,
              email:email,
              username: email,
              profileImageUrl:"../../../../assets/img/default-img/default-user.png"
            });
            signInWithEmailAndPassword(this.auth, email, password).then(cred => {
              //clear fields and re direc
              this.router.navigateByUrl('/owner-home');
              signUpSuccess = true;
            })
          }
        }
      });
     }


  return signUpSuccess;
  }


  SignUpAsDogWalker(file, email: string, password: string, firstName: string, lastName: string, eircode: string, phoneNumber: string, county: string, addressLine: String, availableCounty: string) {


    //uploading an images profile NEED REF TO STORAGE
    let imageName = Date.now().toString();
    let imageUrl
    const storage = getStorage();
    const storageRef = ref(storage, imageName);

    if(file!= null){
        uploadString(storageRef , file ,  'base64').then(res => {
          imageUrl = getDownloadURL(storageRef).then((url) => {
            createUserWithEmailAndPassword(this.auth, email, password).then(cred => {
    
              //add document
              setDoc(doc(this.firestore, "dogwalkers", email), {
                username: email,
                firstName: firstName,
                lastName: lastName,
                eircode: eircode,
                phoneNumber: phoneNumber,
                county: county,
                addressLine: addressLine,
                availableCounty: availableCounty,
                profileImageUrl:url
              });
            }).catch(async (error) => {
              //if the email is already in use
              if (error.code === "auth/email-already-in-use") {
                //we want to check and see if that user already exists as a dog owner (as they may just be dog walker)
                const docRef = doc(this.firestore, "dogwalkers", email);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                } else {
                  // doc.data() will be undefined in this case so they do not exists as a dog owner
                  //therefore we can go ahead and create them as one
                  console.log("User already existed as a dog owner but now they are an walker also")
                  setDoc(doc(this.firestore, "dogwalkers", email), {
                    username: email,
                    firstName: firstName,
                    lastName: lastName,
                    eircode: eircode,
                    phoneNumber: phoneNumber,
                    county: county,
                    addressLine: addressLine,
                    availableCounty: availableCounty,
                    profileImageUrl:url
                  });
                }
              }
        
            });
          })
        })
    }else {
      createUserWithEmailAndPassword(this.auth, email, password).then(cred => {
    
        //add document
        setDoc(doc(this.firestore, "dogwalkers", email), {
          username: email,
          firstName: firstName,
          lastName: lastName,
          eircode: eircode,
          phoneNumber: phoneNumber,
          county: county,
          addressLine: addressLine,
          availableCounty: availableCounty,
          profileImageUrl:"../../../../assets/img/default-img/default-user.png"
        });
      }).catch(async (error) => {
        //if the email is already in use
        if (error.code === "auth/email-already-in-use") {
          //we want to check and see if that user already exists as a dog owner (as they may just be dog walker)
          const docRef = doc(this.firestore, "dogwalkers", email);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
          } else {
            // doc.data() will be undefined in this case so they do not exists as a dog owner
            //therefore we can go ahead and create them as one
            console.log("User already existed as a dog owner but now they are an walker also")
            setDoc(doc(this.firestore, "dogwalkers", email), {
              username: email,
              firstName: firstName,
              lastName: lastName,
              eircode: eircode,
              phoneNumber: phoneNumber,
              county: county,
              addressLine: addressLine,
              availableCounty: availableCounty,
              profileImageUrl:"../../../../assets/img/default-img/default-user.png"
            });
          }
        }
  
      });
    }


 
  }

  loginAsOwner(email: string, password: string) {
    signInWithEmailAndPassword(this.auth, email, password).then(cred => {
      //clear fields and re direc
      this.router.navigateByUrl('/owner-home');
    })

  }

  loginAsWalker(email: string, password: string) {

    signInWithEmailAndPassword(this.auth, email, password).then(cred => {
      //clear fields and re direct

      console.log("login walker triggered in autth", email, password);
      this.router.navigateByUrl('/walker-home');
    })

  }
}
