import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LandingComponent} from "./components/landing/landing.component";
import {CommonModule} from "@angular/common";
import {LoginComponent} from "./components/login/login.component";
import {SignUpComponent} from "./components/sign-up/sign-up.component";
import {HomeComponent} from "./components/home/home.component";
import {canActivate, redirectLoggedInTo, redirectUnauthorizedTo} from "@angular/fire/auth-guard";
import {UserProfileComponent} from "./components/user-profile/user-profile.component";


const toLogin = () => redirectUnauthorizedTo(['login']);
const toHome = () => redirectLoggedInTo(['home'])


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LandingComponent
  },
  {
    path: 'login',
    component: LoginComponent,
    ...canActivate(toHome)
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
    ...canActivate(toHome),
  },
  {
    path: 'home',
    component: HomeComponent,
    ...canActivate(toLogin),
  },
  {
    path: 'user-profile',
    component: UserProfileComponent,
    ...canActivate(toLogin)
  }
];

@NgModule({
  imports: [CommonModule,
    RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
