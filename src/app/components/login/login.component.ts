import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  displayName: string = '';

  constructor(private authService: AuthService, private afAuth: AngularFireAuth, private router: Router) { }

  login() {
    this.authService.signIn(this.email, this.password)
      .then(res => {
        this.router.navigate(['/']);
      })
      .catch(err => {
        console.log('Login error: ', err);
      });
  }

  googleLogin() {
    this.authService.googleSignIn()
      .then(res => {
        this.router.navigate(['']);
      })
      .catch(err => {
        console.log('Google login error: ', err);
      });
  }

  signup() {
    this.authService.signUp(this.email, this.password)
      .then(res => {
        this.afAuth.currentUser.then(user => {
          return user?.updateProfile({
            displayName: this.displayName
          }).then(() => {
            console.log('Successfully signed up!');
            this.router.navigate(['/']);
          }).catch(error => {
            console.log('Error updating profile: ', error);
          });
        });
      })
      .catch(err => {
        console.log('Signup error: ', err);
      });
  }
}
