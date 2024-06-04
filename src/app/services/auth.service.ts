import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth) { }

  // Sign in with email and password
  signIn(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  // Sign up with email and password
  signUp(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  // Sign out
  signOut() {
    return this.afAuth.signOut();
  }

  // Sign in with Google
  googleSignIn() {
    return this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  // Get current user
  getUser() {
    return this.afAuth.authState;
  }

  // Get current user's display name
  getDisplayName() {
    return this.afAuth.currentUser.then(user => user?.displayName || null);
  }
}
