 import { Injectable } from '@angular/core';
 import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
   updateProfile
 } from "@angular/fire/auth";
 import {from, Observable, of} from "rxjs";
 import firebase from "firebase/compat";
 import UserCredential = firebase.auth.UserCredential;
 import {update} from "@angular/fire/database";
 import {concatMap, switchMap} from "rxjs/operators";
 import {User} from "../model/User";
 import UserInfo = firebase.UserInfo;

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  currentUser$ = authState(this.auth);


  constructor(private auth: Auth) {
  }

  signUp(email: string, password: string): Observable<any> {
    return from(createUserWithEmailAndPassword(this.auth, email, password));

  }

  login(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password))
  }

  logout(): Observable<any> {
    return from(this.auth.signOut());
  }

  updateProfileData(profileData: Partial<UserInfo>): Observable<any> {
    const user = this.auth.currentUser;
    return of(user).pipe(
      concatMap((user) => {
        if (!user)
          throw new Error('Not Authenticated');


         return updateProfile(user, profileData)
      })
    )

  }


}
