import {Injectable} from '@angular/core';
import {collection, collectionData, doc, docData, Firestore, query, setDoc, updateDoc} from "@angular/fire/firestore";
import {AuthenticationService} from "./authentication.service";
import {from, Observable, of} from "rxjs";
import {User} from "../model/User";
import {uploadBytes, ref, Storage, getDownloadURL} from "@angular/fire/storage";
import {switchMap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private firestore: Firestore,
              private storage: Storage,
              private authService: AuthenticationService) {
  }

  get currentUserProfile$(): Observable<User | null> {
    return this.authService.currentUser$.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          return of(null);
        }
        const ref = doc(this.firestore, 'users', user?.uid);
        return docData(ref) as Observable<User>
      })
    );
  }

  uploadImage(image: File, path: string): Observable<string> {
    const storageRef = ref(this.storage, path);
    const uploadTask = from(uploadBytes(storageRef, image));
    return uploadTask.pipe(
      switchMap((result) => getDownloadURL(result.ref)));
  }

  get users$(): Observable<User[]> {
    const ref = collection(this.firestore, 'users');
    const queryAll = query(ref);
    return collectionData(queryAll) as Observable<User[]>;
  }

  addUserProfile(user: User): Observable<any> {
    const ref = doc(this.firestore, 'users', user?.uid);
    return from(setDoc(ref, user));
  }

  update(user: User): Observable<any> {
    const ref = doc(this.firestore, 'users', user?.uid);
    return from(updateDoc(ref, {...user}));
  }


}

