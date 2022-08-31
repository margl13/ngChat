import {Injectable} from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  TwitterAuthProvider,
} from "@angular/fire/auth";
import {from, Observable} from "rxjs";
import {Router} from "@angular/router";
import {HotToastService} from "@ngneat/hot-toast";
import {AngularFireAuth} from "@angular/fire/compat/auth";


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  currentUser$ = authState(this.auth);


  constructor(private auth: Auth,
              private router: Router,
              private toast: HotToastService,
              public afAuth: AngularFireAuth,
  ) {
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


  TwitterAuth() {
    return this.AuthLogin(new TwitterAuthProvider())
  }


  AuthLogin(provider) {
    return this.afAuth.signInWithPopup(provider).then((result) => {
      console.log('You have been successfully logged in!');
    }).catch((error) => {
      console.log(error);
    });


  }
}
