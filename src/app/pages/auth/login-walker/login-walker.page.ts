import { Component, OnInit } from '@angular/core';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login-walker',
  templateUrl: './login-walker.page.html',
  styleUrls: ['./login-walker.page.scss', '../auth.scss'],
})
export class LoginWalkerPage implements OnInit {

  //set login variables
  email: string;
  password: string;

  //user logged in is our flag
  userLoggedIn: boolean = false;

  // variable - default false for login password 
  show: boolean = false;

  constructor(private router: Router, private auth: AuthService, private alrt: AlertController) { }

  ngOnInit() {
  }

  SignIn() {

    //call the firestore sign in method passing the email and password , along with a then 

    //this.auth.loginAsWalker(this.email,this.password);
    signInWithEmailAndPassword(getAuth(), this.email, this.password).then(cred => {
      //clear fields and re direct


      this.router.navigateByUrl('/walker-home');
    }).catch(async err => {

      console.log("error message ", err.code);
      let errorMesage = this.convertMessage(err.code);
      //male alert 
      const alert = await this.alrt.create({
        cssClass: 'my-custom-class',
        header: 'Woops !',
        subHeader: 'Login error',
        message: errorMesage,
        buttons: ['OK']
      });

      await alert.present();

    });

  }


  convertMessage(code: string): string {

    switch (code) {
      case 'auth/missing-email': {
        return 'Dont forget an email address ..';
      }

      case 'auth/user-disabled': {
        return 'Sorry your user is disabled.';
      }
      case 'auth/user-disabled': {
        return 'Sorry your user is disabled.';
      }
      case 'auth/user-not-found': {
        return 'Sorry user not found , check details and try again.';
      }

      default: {
        return ' try that again !.';
      }
    }
  }

  // click event function toggle
  showPassword() {
    this.show = !this.show;
  }

}
