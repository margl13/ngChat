import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {initializeApp, provideFirebaseApp} from "@angular/fire/app";
import {environment} from "../environments/environment";
import {HomeComponent} from './components/home/home.component';
import {LoginComponent} from './components/login/login.component';
import {SignUpComponent} from './components/sign-up/sign-up.component';
import {LandingComponent} from './components/landing/landing.component';
import {ReactiveFormsModule} from "@angular/forms";
import {getAuth, provideAuth} from "@angular/fire/auth";
import {HotToastModule} from '@ngneat/hot-toast';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatAutocomplete, MatAutocompleteModule} from "@angular/material/autocomplete";
import {getFirestore, provideFirestore} from "@angular/fire/firestore";
import {getStorage, provideStorage} from "@angular/fire/storage";
import {UserProfileComponent} from './components/user-profile/user-profile.component';
import {MatListModule} from "@angular/material/list";
import {MatDividerModule} from "@angular/material/divider";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {DateDisplayPipe} from './pipes/dateDisplay.pipe';
import {DatePipe} from "@angular/common";


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SignUpComponent,
    LandingComponent,
    UserProfileComponent,
    DateDisplayPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    ReactiveFormsModule,
    HotToastModule.forRoot(),
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatListModule,
    MatDividerModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule {
}
